import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

interface OtpButtonProps {
    requestOtp: () => void; // Function to request OTP
    isOtpVerified: boolean; // Boolean indicating if OTP is verified
    requestOtpCustomerStatus: { loading: boolean }; // Object containing loading status for OTP request
    registrationFormErrors: { [key: string]: string }; // Errors object from the registration form
  }
  
  const OtpButton: React.FC<OtpButtonProps> = ({
    requestOtp,
    isOtpVerified,
    requestOtpCustomerStatus,
    registrationFormErrors,
  }) => {
    useEffect(()=>{
        console.log("rendered the otp button");
    }, [])
    
    return (
      <div className="otp_btns">
        <Button
          variant="itself"
          className="get_otp_btn"
          onClick={requestOtp}
          disabled={isOtpVerified}
        >
          <span>
            {!requestOtpCustomerStatus.loading ? (
              !isOtpVerified &&
              registrationFormErrors["mobile"] !== "Invalid Phone" ? (
                "Get OTP"
              ) : !registrationFormErrors["mobile"] && isOtpVerified ? (
                "Verified"
              ) : null
            ) : (
              <LoaderCircle className="animate-spin" />
            )}
          </span>
        </Button>
      </div>
    );
  };
  
  export default OtpButton;