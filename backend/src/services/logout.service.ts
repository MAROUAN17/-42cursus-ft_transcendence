import type { FastifyRequest, FastifyReply } from "fastify"

export const logoutUser =  async (req: FastifyRequest, res: FastifyReply) => {
    try {
        res.clearCookie('refreshToken', { 
            path: '/',
            secure: true,
            httpOnly: true, 
            sameSite: 'lax'
        });
        res.clearCookie('accessToken', { 
            path: '/',
            secure: true,
            httpOnly: true, 
            sameSite: 'lax'
        });
    } catch (error) {
        res.status(500).send({ error: error });
    }
}