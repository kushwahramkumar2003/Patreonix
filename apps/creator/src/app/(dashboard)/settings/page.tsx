import { Suspense } from "react";
import Settings, {
  SettingsProps,
} from "@/components/(dashboard)/settings/Settings";
import { getCreatorPda, getServerAnchorProgramm } from "@/lib/anchor";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PublicKey } from "@solana/web3.js";
import { authOptions } from "@/lib/authOptions";

const fetchData = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.publicKey) {
    return redirect("/login");
  }
  try {
    const userPublicKey = new PublicKey(session.user.publicKey);
    const creatorPda = await getCreatorPda(userPublicKey);
    const program = await getServerAnchorProgramm();
    const fetchResult = await program.account.creator.fetch(creatorPda);
    return fetchResult;
  } catch (error) {
    console.error("Failed to fetch creator details:", error);
    return null;
  }
};

export default async function SettingsPage() {
  const data = await fetchData();

  console.log("Data:", data);

  return (
    <Suspense fallback={<div>Loading creator details...</div>}>
      <Settings data={data} />
    </Suspense>
  );
}
