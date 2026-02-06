import GameBoard from "@/components/GameBoard";

export default function Home() {
  return (
    <div className="flex min-h-screen w-5/6 xl:w-2/3 mx-auto items-center justify-center font-sans dark:bg-black">
      <GameBoard />
    </div>
  );
}
