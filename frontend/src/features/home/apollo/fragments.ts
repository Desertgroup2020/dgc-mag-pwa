import { gql } from "@apollo/client";

export const BannerBlock = gql`
  fragment BannerBlock on BannerBlock {
    banner_template
    desktop_status
    mobile_status
    title
    banneritems {
      image
      layout
      subtitle
      link_info {
        category_id
        external_url
        link_type
        link_url
        open_tab
        page_id
        product_id
        product_sku
      }
      position
      title
    }
  }
`;

export const SliderBlock = gql`
  fragment SliderBlock on SliderBlock {
    autoplay
    autoplay_hover_pause
    autoplay_timeout
    desktop_status
    id
    type
    mobile_status
    show_dots
    show_title
    slider_width
    store
    store_label
    title
    templateType
    sliders {
      button_label
      button_position
      description
      description_position
      display_button
      end_date
      description_color
      title_color
      link_info {
        category_id
        external_url
        link_type
        link_url
        open_tab
        page_id
        product_id
        product_sku
      }
      link_type
      position
      slider_image
      start_date
      title
    }
    banners {
      image
      layout
      link_info {
        category_id
        external_url
        link_type
        link_url
        open_tab
        page_id
        product_id
        product_sku
      }
      position
      title
    }
  }
`;

export const CategoryBlock = gql`
  fragment CategoryBlock on CategoryBlock {
    category_info {
      category_id
      image
      name
      url_key
      url_path
    }
    desktop_status
    id
    mobile_status
    show_title
    store
    store_label
    title
    type
  }
`;

export const ContentBlock = gql`
  fragment ContentBlock on ContentBlock {
    content
    desktop_status
    id
    mobile_status
    show_title
    store
    store_label
    title
    type
  }
`;

export const CustomBlock = gql`
  fragment CustomBlock on CustomBlock {
    description
    desktop_status
    id
    image
    link_info {
      category_id
      external_url
      link_type
      link_url
      open_tab
      page_id
      product_id
      product_sku
    }
    mobile_status
    products {
      canonical_url
      country_of_manufacture
      description {
        html
      }
      name
      sku
    }
    viewall_status
    type
    title
    store_label
    store
    show_title
  }
`;

export const ProductBlock = gql`
  fragment ProductBlock on ProductBlock {
    description
    desktop_status
    display_style
    id
    mobile_status
    product_type
    products {
      name
      sku
      url_suffix
      url_key
      stock_status
      url_rewrites {
        url
      }
      image {
        url
        label
      }
      media_gallery {
        url
      }
      special_price
      price_range {
        minimum_price {
          regular_price {
            value
          }
          final_price {
            value
            currency
          }
        }
        maximum_price {
          final_price {
            value
          }
        }
      }
      mp_label_data {
        label_template
        label_image
        label
      }
    }
    show_title
    store
    store_label
    store_label
    title
    type
    viewall_status
  }
`;

export const PopUp = gql`
  fragment PopUp on PopUp {
    block_identifier
    click_url {
      category_id
      product_sku
      product_id
      external_url
      link_type
      link_url
      open_tab
      page_id
      product_id
      product_sku
    }
    desktop_status
    end_date
    id
    mobile_status
    popup_image
    popup_type
    show_title
    start_date
    store
    store_label
    title
    type
    video_link
    video_thumbnail
  }
`;

export const TaggedImageBlock = gql`
  fragment TaggedImageBlock on TaggedImageBlock {
    title_image
    id
    title_position
    banner_template
    desktop_status
    mobile_status
    mapped_image {
      image
      postion
      area {
        coords
        link
        shape
        toolTip
        link_info {
          category_id
          external_url
          link_type
          link_url
          open_tab
          page_id
          product_id
          product_sku
        }
      }
    }
    mapped_mobile_image {
      image
      postion
      area {
        coords
        link
        shape
        toolTip
        link_info {
          category_id
          external_url
          link_type
          link_url
          open_tab
          page_id
          product_id
          product_sku
        }
      }
    }
  }
`;

export const FeaturedBrandsBlock = gql`
  fragment FeaturedBrandsBlock on FeaturedBrandsBlock {
    featured_brands {
      brand_id
      image
      label
    }
    desktop_status
    id
    mobile_status
    show_title
    store
    store_label
    type
  }
`;

export const TestimonialBlock = gql`
  fragment TestimonialBlock on TestimonialBlock {
    desktop_status
    id
    mobile_status
    testimonial_info {
      testimonial_id
      status
      customer_name
      image
      added_at
      description
      source {
        image
        title
        url
      }
    }
  }
`;
