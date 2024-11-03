import { NextApiRequest, NextApiResponse } from "next";

import { pusherServer } from "@/lib/pusher";
import { auth } from "@/auth";

export default async function handlers(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // Verificar que el método HTTP sea POST
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  // Obtener la sesión del servidor
  const session = await auth();

  // Comprobar si la sesión es válida y si tiene un email de usuario
  if (!session?.user?.email) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { socket_id: socketId, channel_name: channel } = request.body;

  if (!socketId || !channel) {
    return response
      .status(400)
      .json({ message: "Socket ID and Channel name are required" });
  }

  const data = {
    user_id: session.user.email,
  };

  // Autorizar el canal usando Pusher
  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  // Enviar la respuesta de autorización
  return response.json(authResponse);
}
