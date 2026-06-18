export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0F19] text-gray-400 p-6 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-2">
        <p>&copy; {new Date().getFullYear()} NHSM Student Hub. All rights reserved.</p>
        <p className="text-sm">Built for the students of the National Higher School of Mathematics.</p>
      </div>
    </footer>
  );
}
