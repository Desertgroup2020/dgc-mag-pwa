import React from "react";
import { LoaderCircle } from "lucide-react";

type CircularProgressProps = React.SVGProps<SVGSVGElement>;
function CircularProgress(props: CircularProgressProps) {
  const updatedProps = {...props};
  delete updatedProps.className;  
  return <LoaderCircle className={`animate-spin ${props.className}`} {...updatedProps} />;
}

export default CircularProgress;
