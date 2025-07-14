import { ProductViewReportOutput } from "@/generated/types";
import { gql } from "@apollo/client";

const SET_PRODUCT_REPORT_MUTATION = gql`
  mutation setProductViewReport($sku: String!) {
    setProductViewReport(sku: $sku) {
      status
    }
  }
`;

export type SetProductReportMutationType = {
  Variables: {
    sku: string;
  };
  Response: {
    setProductViewReport: ProductViewReportOutput;
  };
};

export default SET_PRODUCT_REPORT_MUTATION;
