import { BatchJobService, CartService, ClaimItemService, ClaimService, CurrencyService, CustomerService, DiscountService, DraftOrderService, GiftCardService, NoteService, OrderEditItemChangeService, OrderEditService, OrderService, ProductService } from "@medusajs/medusa";
import { PaymentCollectionService, PaymentService, ProductCategoryService, ProductVariantService, RegionService, SalesChannelService, SwapService, TokenService, UserService } from "@medusajs/medusa/dist/services";

const kafkaEvents = [
    BatchJobService.Events.CREATED,
    BatchJobService.Events.CANCELED,
    BatchJobService.Events.COMPLETED,
    BatchJobService.Events.FAILED,
    BatchJobService.Events.PRE_PROCESSED,
    BatchJobService.Events.PROCESSING,
    BatchJobService.Events.UPDATED,
    BatchJobService.Events.CONFIRMED,

    CartService.Events.CREATED,
    CartService.Events.CUSTOMER_UPDATED,
    CartService.Events.UPDATED,

    ClaimService.Events.CANCELED,
    ClaimService.Events.CREATED,
    ClaimService.Events.FULFILLMENT_CREATED,
    ClaimService.Events.REFUND_PROCESSED,
    ClaimService.Events.SHIPMENT_CREATED,
    ClaimService.Events.UPDATED,

    ClaimItemService.Events.CANCELED,
    ClaimItemService.Events.CREATED,
    ClaimItemService.Events.UPDATED,

    CurrencyService.Events.UPDATED,

    CustomerService.Events.CREATED,
    CustomerService.Events.PASSWORD_RESET,
    CustomerService.Events.UPDATED,

    DiscountService.Events.CREATED,

    DraftOrderService.Events.CREATED,
    DraftOrderService.Events.UPDATED,

    GiftCardService.Events.CREATED,

    'inventory-item.created',
    'inventory-item.updated',
    'inventory-item.deleted',

    'inventory-level.created',
    
    'invite.created',

    NoteService.Events.CREATED,
    NoteService.Events.DELETED,
    NoteService.Events.UPDATED,

    OrderService.Events.CANCELED,
    OrderService.Events.COMPLETED,
    OrderService.Events.FULFILLMENT_CANCELED,
    OrderService.Events.FULFILLMENT_CREATED,
    OrderService.Events.GIFT_CARD_CREATED,
    OrderService.Events.ITEMS_RETURNED,
    OrderService.Events.PAYMENT_CAPTURED,
    OrderService.Events.PAYMENT_CAPTURE_FAILED,
    OrderService.Events.PLACED,
    OrderService.Events.REFUND_CREATED,
    OrderService.Events.REFUND_FAILED,
    OrderService.Events.RETURN_ACTION_REQUIRED,
    OrderService.Events.RETURN_REQUESTED,
    OrderService.Events.SHIPMENT_CREATED,
    OrderService.Events.SWAP_CREATED,
    OrderService.Events.UPDATED,

    OrderEditService.Events.CONFIRMED,
    OrderEditService.Events.CANCELED,
    OrderEditService.Events.CREATED,
    OrderEditService.Events.DECLINED,
    OrderEditService.Events.REQUESTED,
    OrderEditService.Events.UPDATED,

    OrderEditItemChangeService.Events.CREATED,
    OrderEditItemChangeService.Events.DELETED,

    PaymentService.Events.CREATED,
    PaymentService.Events.PAYMENT_CAPTURED,
    PaymentService.Events.PAYMENT_CAPTURE_FAILED,
    PaymentService.Events.REFUND_CREATED,
    PaymentService.Events.REFUND_FAILED,
    PaymentService.Events.UPDATED,

    PaymentCollectionService.Events.CREATED,
    PaymentCollectionService.Events.DELETED,
    PaymentCollectionService.Events.PAYMENT_AUTHORIZED,
    PaymentCollectionService.Events.UPDATED,

    ProductService.Events.CREATED,
    ProductService.Events.DELETED,
    ProductService.Events.UPDATED,

    ProductCategoryService.Events.CREATED,
    ProductCategoryService.Events.DELETED,
    ProductCategoryService.Events.UPDATED,

    ProductVariantService.Events.CREATED,
    ProductVariantService.Events.DELETED,
    ProductVariantService.Events.UPDATED,

    RegionService.Events.CREATED,
    RegionService.Events.DELETED,
    RegionService.Events.UPDATED,

    SalesChannelService.Events.CREATED,
    SalesChannelService.Events.DELETED,
    SalesChannelService.Events.UPDATED,


    'stock-location.created',
    'stock-location.updated',
    'stock-location.deleted',

    SwapService.Events.CREATED,
    SwapService.Events.FULFILLMENT_CREATED,
    SwapService.Events.PAYMENT_CAPTURED,
    SwapService.Events.PAYMENT_CAPTURE_FAILED,
    SwapService.Events.PAYMENT_COMPLETED,
    SwapService.Events.PROCESS_REFUND_FAILED,
    SwapService.Events.RECEIVED,
    SwapService.Events.REFUND_PROCESSED,
    SwapService.Events.SHIPMENT_CREATED,

    'order-update-token.created',

    UserService.Events.CREATED,
    UserService.Events.DELETED,
    UserService.Events.PASSWORD_RESET,
    UserService.Events.UPDATED,

]
  

export default kafkaEvents;
