import { domToReact } from "html-react-parser";

interface BannerProps {
  content: any;
}

const BannerComponent: React.FC<BannerProps> = ({ content }) => {
  return (
    <div className="banner">
      {domToReact(content)} {/* Render children nodes */}
    </div>
  );
};

export default BannerComponent;
