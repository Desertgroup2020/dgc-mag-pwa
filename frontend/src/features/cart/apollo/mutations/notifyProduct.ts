import { gql } from "@apollo/client";

const NOTIFY_PRODUCT = gql`
    mutation notifyProduct(
        $sku: String!
        $type: String!
    ){
        productAlertSubscribe(
            sku: $sku
            type: $type
        )
    }
`

export type NotifyProductType = {
    Response: {
        productAlertSubscribe: boolean
    },
    Variables: {
        sku: string,
        type: "PRODUCT_ALERT_PRICE_DROP" | "PRODUCT_ALERT_STOCK"
    }
}

export default NOTIFY_PRODUCT