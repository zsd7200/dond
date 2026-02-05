import GameBoard from "@/components/GameBoard";

export default function Home() {
  return (
    <div className="flex min-h-screen w-2/3 mx-auto items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <GameBoard />
    </div>
  );
}
