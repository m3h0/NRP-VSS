import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Role } from "@prisma/client"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data
                    const user = await prisma.user.findUnique({ where: { email } })

                    if (!user) return null

                    const passwordsMatch = await bcrypt.compare(password, user.password || "");
                    if (passwordsMatch) {
                        // Explicitly return the user with role
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role,
                        };
                    }
                }

                return null
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }

            if (trigger === "update") {
                if (session?.image) token.picture = session.image;
                if (session?.name) token.name = session.name;
            }

            // Fallback: If role is missing, fetch it from DB
            if (!token.role && token.email) {
                const u = await prisma.user.findUnique({ where: { email: token.email } });
                if (u) {
                    // @ts-ignore
                    token.role = u.role;
                    token.id = u.id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
    },
})
