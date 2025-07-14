"use client";

import { CmsBlock } from "@/generated/types";
import React, { useState } from "react";
import HotForm, { HotFormValues } from "../components/HotForm";
import useMutations from "../hooks/useMutations";
import Modal from "@/components/reusable-uis/Modal";
import { useToast } from "@/components/ui/use-toast";
import Smile from "@/components/icons/Smile";

type HotPageClientProps = {
  hotTextContents: CmsBlock;
  hotImageContents: CmsBlock;
};
function HotPageClient({
  hotImageContents,
  hotTextContents,
}: HotPageClientProps) {
  //   hooks
  const {
    createHotRequest: [createHotRequest, createHotRequestStatus],
  } = useMutations();
  const { toast } = useToast();

  //   states
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);

  //   features
  const onSubmitForm = (values: HotFormValues) => {
    if (values) {
      createHotRequest({
        variables: values,
        onCompleted(data, clientOptions) {
          if (data.createHotRequest.success) {
            setVerificationModalOpen(true)
            setVerificationMsg(
              data.createHotRequest.message || "Will get in touch soon"
            );
          }
        },
        onError(error, clientOptions) {
          toast({
            title: "Hot Enquiry",
            description: error.message || "Ooops",
            variant: "error",
          });
        },
      });
    }
  };
  const handleVerificationModalOpen = () => {
    setVerificationModalOpen((prev) => !prev);
  };

  return (
    <div className="hot_client">
      {/* <div dangerouslySetInnerHTML={{__html: hotTextContents.content || ""}}></div>
        <div dangerouslySetInnerHTML={{__html: hotImageContents.content || ""}}></div> */}
      <div className="container">
        <div className="divider">
          <div className="left">
            <div className="txt_contents">
              <div
                dangerouslySetInnerHTML={{
                  __html: hotTextContents.content || "",
                }}
              ></div>
              <div className="hot_form_wrap">
                <HotForm
                  onSubmit={onSubmitForm}
                  isSubmiting={createHotRequestStatus.loading}
                />
              </div>
            </div>
          </div>
          <div className="right">
            <div className="img_contents">
              <div
                dangerouslySetInnerHTML={{
                  __html: hotImageContents.content || "",
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={verificationModalOpen}
        setIsOpen={handleVerificationModalOpen}
        notCloseOnOutside={true}
        className="order_complete_modal"
      >
        <div className={`common_success_content`}>
          <div className="inner">
            <Smile />
            <h2 className="text-h2">Success!</h2>
            <p>
              <span className=" font-600">{verificationMsg}</span>
            </p>            
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HotPageClient;
