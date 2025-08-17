
export const clients = new Map<string, any>();

export function broadcast(message: any) {
  console.log("Broadcasting to clients...");
  for (const [id, conn] of clients) {
    console.log("->", id);
    conn.send(JSON.stringify(message));
  }
}
