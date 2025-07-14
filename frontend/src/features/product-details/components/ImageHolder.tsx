import Image from "next/image";
import React from "react";
import { usePdpContext } from "../hooks/pdpContext";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools">
      <button onClick={() => zoomIn()}>
        <ZoomIn stroke="#fff" />
      </button>
      <button onClick={() => zoomOut()}>
        <ZoomOut stroke="#fff" />
      </button>
      <button onClick={() => resetTransform()}>
        <RotateCcw width={20} stroke="#fff" />
      </button>
    </div>
  );
};

function ImageHolder() {
  const { currentMedia, productImage, currentProduct } = usePdpContext();

  return (
    <div className="image_holder">
      <TransformWrapper
        initialScale={1}
        maxScale={2}
        // initialPositionX={200}
        // initialPositionY={100}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Controls />
            <TransformComponent
              wrapperClass="image_maginifier"
              contentClass="magnifier_contents"
            >
              <Image
                src={currentMedia?.media_file || productImage.url || ""}
                fill
                alt={`Image Preview of ${currentProduct.name}`}
                objectFit="contain"
              />
              {/* <div>Example text</div> */}
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

export default ImageHolder;
