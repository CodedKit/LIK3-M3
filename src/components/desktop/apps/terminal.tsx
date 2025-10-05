export default function TerminalApp() {
  return (
    <div className="h-full w-full bg-black p-4 font-code text-sm text-green-400">
      <p>Welcome to Virtual Temptations Terminal</p>
      <p>&gt; Type 'help' for a list of commands.</p>
      <div className="flex gap-2 pt-4">
        <span className="text-pink-500">user@virtual-temptations:~$</span>
        <span className="flex-1">
          <span className="animate-pulse">_</span>
        </span>
      </div>
    </div>
  );
}
