import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import { oswald } from '@/app/ui/fonts';

export default function MusicLogo() {
  return (
    <div
      className={`${oswald.className} flex flex-row items-center leading-none text-white`}
    >
      <MusicalNoteIcon className="h-12 w-12" />
      <p className="text-[27px]">Music Time!</p>
    </div>
  );
}
