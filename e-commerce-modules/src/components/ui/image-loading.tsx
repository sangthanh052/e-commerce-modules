import { PiImageSquare } from "react-icons/pi";

function ImageLoading() {
  return (
    <div className="w-full aspect-square flex items-center justify-center bg-primary/20 rounded-md absolute inset-0">
      <PiImageSquare className="w-5/12 h-auto text-primary" />
    </div>
  );
}

export default ImageLoading;
