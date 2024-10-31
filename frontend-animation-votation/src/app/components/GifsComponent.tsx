import Image from "next/image";
import { useSettings } from "@/app/context/SettingsContext";
import Kita from "@/app/img/kita-chan-kitaikuyo.gif";
import Konata from "@/app/img/konata.gif";

const GifsComponent = () => {
  const { gifsEnabled } = useSettings();

  return (
    <>
      <Image
        src={Kita}
        hidden={!gifsEnabled}
        unoptimized
        height={150}
        alt="Kita icon"
        className="fixed bottom-0 right-4"
      />
      <Image
        src={Konata}
        hidden={!gifsEnabled}
        unoptimized
        priority
        height={200}
        alt="Konata icon"
        className="fixed bottom-0 left-0"
      />
    </>
  );
};

export default GifsComponent;
