// Public API root error.code constants. External PAC/SAT codes belong in
// errors[].code and are intentionally not included here.

type ErrorCodeValue<T> = T[keyof T]

export const CommonErrorCode = {
  CONFLICT: 'conflict',
  FORBIDDEN: 'forbidden',
  INTERNAL_ERROR: 'internal_error',
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
} as const
export type CommonErrorCode = ErrorCodeValue<typeof CommonErrorCode>

export const AuthErrorCode = {
  API_KEY_INVALID: 'api_key_invalid',
  API_KEY_NOT_ALLOWED: 'api_key_not_allowed',
  FEATURE_NOT_AVAILABLE: 'feature_not_available',
  LIVE_API_KEY_REQUIRED: 'live_api_key_required',
  MCP_PERMISSION_DENIED: 'mcp_permission_denied',
  MISSING_CREDENTIALS: 'missing_credentials',
  ORGANIZATION_INCOMPLETE: 'organization_incomplete',
  SUBSCRIPTION_REQUIRED: 'subscription_required',
  SUBSCRIPTION_LIVE_ACCESS_REQUIRED: 'subscription_live_access_required',
  USER_KEY_INVALID: 'user_key_invalid',
  USER_SUSPENDED: 'user_suspended',
} as const
export type AuthErrorCode = ErrorCodeValue<typeof AuthErrorCode>

export const RequestErrorCode = {
  IDEMPOTENCY_KEY_IN_USE: 'idempotency_key_in_use',
  RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
  DATE_RANGE_TOO_LARGE: 'date_range_too_large',
  IMAGE_FILE_REQUIRED: 'image_file_required',
  INVALID_COUNTRY_CODE: 'invalid_country_code',
  INVALID_DATE: 'invalid_date',
  INVALID_DATE_RANGE: 'invalid_date_range',
  INVALID_IMAGE_FILE: 'invalid_image_file',
  INVALID_JSON: 'invalid_json',
  INVALID_REQUEST: 'invalid_request',
  INVALID_MULTIPART_FORM_DATA: 'invalid_multipart_form_data',
  INVALID_STATE_CODE: 'invalid_state_code',
  INVALID_TIMEZONE: 'invalid_timezone',
  MULTIPART_LIMIT_EXCEEDED: 'multipart_limit_exceeded',
  PAGE_TOO_LARGE: 'page_too_large',
  PAYLOAD_TOO_LARGE: 'payload_too_large',
} as const
export type RequestErrorCode = ErrorCodeValue<typeof RequestErrorCode>

export const CustomerErrorCode = {
  CUSTOMER_COULD_NOT_BE_RESOLVED: 'customer_could_not_be_resolved',
  CUSTOMER_EDIT_LINK_NOT_FOUND: 'customer_edit_link_not_found',
  CUSTOMER_EDIT_LINK_UNAVAILABLE: 'customer_edit_link_unavailable',
  CUSTOMER_EMAIL_REQUIRED: 'customer_email_required',
  CUSTOMER_HAS_INVOICES: 'customer_has_invoices',
  CUSTOMER_NOT_FOUND: 'customer_not_found',
  CUSTOMER_TAX_INFO_UNAVAILABLE: 'customer_tax_info_unavailable',
} as const
export type CustomerErrorCode = ErrorCodeValue<typeof CustomerErrorCode>

export const TaxInfoValidationCode = {
  LEGAL_NAME_MISMATCH: 'legal_name_mismatch',
  TAX_ADDRESS_ZIP_MISMATCH: 'tax_address_zip_mismatch',
  TAX_ID_NOT_FOUND: 'tax_id_not_found',
  TAX_SYSTEM_NOT_ALLOWED_FOR_TAX_ID: 'tax_system_not_allowed_for_tax_id',
  TAX_SYSTEM_NOT_IN_CATALOG: 'tax_system_not_in_catalog',
} as const
export type TaxInfoValidationCode = ErrorCodeValue<typeof TaxInfoValidationCode>

export const ProductErrorCode = {
  PRODUCT_NOT_FOUND: 'product_not_found',
} as const
export type ProductErrorCode = ErrorCodeValue<typeof ProductErrorCode>

export const SupplierErrorCode = {
  SUPPLIER_NOT_FOUND: 'supplier_not_found',
} as const
export type SupplierErrorCode = ErrorCodeValue<typeof SupplierErrorCode>

export const CatalogErrorCode = {
  PRODUCT_KEY_NOT_FOUND: 'product_key_not_found',
  TARIFF_CODE_NOT_FOUND: 'tariff_code_not_found',
  UNIT_KEY_NOT_FOUND: 'unit_key_not_found',
} as const
export type CatalogErrorCode = ErrorCodeValue<typeof CatalogErrorCode>

export const InvoiceErrorCode = {
  INVOICE_ALREADY_STAMPED: 'invoice_already_stamped',
  INVOICE_NOT_DRAFT: 'invoice_not_draft',
  INVOICE_NOT_FOUND: 'invoice_not_found',
  INVOICE_NOT_STAMPED: 'invoice_not_stamped',
} as const
export type InvoiceErrorCode = ErrorCodeValue<typeof InvoiceErrorCode>

export const InvoiceDraftErrorCode = {
  DRAFT_NOT_READY_TO_STAMP: 'draft_not_ready_to_stamp',
  DRAFT_UPDATE_IN_PROGRESS: 'draft_update_in_progress',
} as const
export type InvoiceDraftErrorCode = ErrorCodeValue<typeof InvoiceDraftErrorCode>

export const InvoiceStampingErrorCode = {
  INVOICE_STAMPING_FAILED: 'invoice_stamping_failed',
  INVOICE_STAMPING_SERVICE_UNAVAILABLE: 'invoice_stamping_service_unavailable',
  INVOICE_STAMPING_VALIDATION_ERROR: 'invoice_stamping_validation_error',
  MANIFESTO_SIGNATURE_FAILED: 'manifesto_signature_failed',
  STAMPING_IN_PROGRESS: 'stamping_in_progress',
} as const
export type InvoiceStampingErrorCode = ErrorCodeValue<
  typeof InvoiceStampingErrorCode
>

export const InvoiceDeliveryErrorCode = {
  INVOICE_EMAIL_DELIVERY_FAILED: 'invoice_email_delivery_failed',
  INVOICE_EMAIL_RECIPIENT_REQUIRED: 'invoice_email_recipient_required',
  INVOICE_EMAIL_STATUS_NOT_ALLOWED: 'invoice_email_status_not_allowed',
} as const
export type InvoiceDeliveryErrorCode = ErrorCodeValue<
  typeof InvoiceDeliveryErrorCode
>

export const InvoiceCancellationErrorCode = {
  INVOICE_CANCELLATION_IN_PROGRESS: 'invoice_cancellation_in_progress',
  INVOICE_CANCELLATION_RECEIPT_UNAVAILABLE:
    'invoice_cancellation_receipt_unavailable',
  INVOICE_CANCELLATION_FAILED: 'invoice_cancellation_failed',
  INVOICE_CANCELLATION_NOT_ALLOWED: 'invoice_cancellation_not_allowed',
  INVOICE_CANCELLATION_NOT_FOUND: 'invoice_cancellation_not_found',
  INVOICE_CANCELLATION_RFC_MISMATCH: 'invoice_cancellation_rfc_mismatch',
  INVOICE_CANCELLATION_SERVICE_UNAVAILABLE:
    'invoice_cancellation_service_unavailable',
  INVOICE_NOT_CANCELABLE: 'invoice_not_cancelable',
  INVOICE_NOT_CANCELABLE_BY_SAT: 'invoice_not_cancelable_by_sat',
  SUBSTITUTION_INVOICE_CANCELED: 'substitution_invoice_canceled',
  SUBSTITUTION_INVOICE_NOT_FOUND: 'substitution_invoice_not_found',
  SUBSTITUTION_INVOICE_REQUIRED: 'substitution_invoice_required',
  SUBSTITUTION_INVOICE_STATUS_NOT_ALLOWED:
    'substitution_invoice_status_not_allowed',
} as const
export type InvoiceCancellationErrorCode = ErrorCodeValue<
  typeof InvoiceCancellationErrorCode
>

export const ReceiptErrorCode = {
  RECEIPT_EXPIRED: 'receipt_expired',
  RECEIPT_NOT_FOUND: 'receipt_not_found',
  RECEIPT_NOT_OPEN: 'receipt_not_open',
} as const
export type ReceiptErrorCode = ErrorCodeValue<typeof ReceiptErrorCode>

export const ReceiptInvoicingErrorCode = {
  RECEIPT_INVOICING_ADDRESS_MISMATCH: 'receipt_invoicing_address_mismatch',
  RECEIPT_INVOICING_CUSTOMER_MISMATCH: 'receipt_invoicing_customer_mismatch',
  RECEIPT_INVOICING_TOO_MANY_ITEMS: 'receipt_invoicing_too_many_items',
  RECEIPT_KEYS_NOT_FOUND: 'receipt_keys_not_found',
} as const
export type ReceiptInvoicingErrorCode = ErrorCodeValue<
  typeof ReceiptInvoicingErrorCode
>

export const ReceiptGlobalInvoiceErrorCode = {
  GLOBAL_INVOICE_TOO_MANY_ITEMS: 'global_invoice_too_many_items',
  INVALID_GLOBAL_INVOICE_PERIOD: 'invalid_global_invoice_period',
} as const
export type ReceiptGlobalInvoiceErrorCode = ErrorCodeValue<
  typeof ReceiptGlobalInvoiceErrorCode
>

export const RetentionErrorCode = {
  INVALID_RETENTION_COMPLEMENT: 'invalid_retention_complement',
  RETENTION_NOT_FOUND: 'retention_not_found',
  RETENTION_NOT_STAMPED: 'retention_not_stamped',
  RETENTION_NOT_CANCELABLE: 'retention_not_cancelable',
} as const
export type RetentionErrorCode = ErrorCodeValue<typeof RetentionErrorCode>

export const RetentionDeliveryErrorCode = {
  RETENTION_EMAIL_DELIVERY_FAILED: 'retention_email_delivery_failed',
  RETENTION_EMAIL_RECIPIENT_REQUIRED: 'retention_email_recipient_required',
  RETENTION_EMAIL_STATUS_NOT_ALLOWED: 'retention_email_status_not_allowed',
} as const
export type RetentionDeliveryErrorCode = ErrorCodeValue<
  typeof RetentionDeliveryErrorCode
>

export const RetentionCancellationErrorCode = {
  RETENTION_CANCELLATION_FAILED: 'retention_cancellation_failed',
  RETENTION_CANCELLATION_SERVICE_UNAVAILABLE:
    'retention_cancellation_service_unavailable',
} as const
export type RetentionCancellationErrorCode = ErrorCodeValue<
  typeof RetentionCancellationErrorCode
>

export const RetentionStampingErrorCode = {
  RETENTION_STAMPING_FAILED: 'retention_stamping_failed',
  RETENTION_STAMPING_SERVICE_UNAVAILABLE:
    'retention_stamping_service_unavailable',
  RETENTION_STAMPING_VALIDATION_ERROR: 'retention_stamping_validation_error',
} as const
export type RetentionStampingErrorCode = ErrorCodeValue<
  typeof RetentionStampingErrorCode
>

export const OrganizationErrorCode = {
  INVALID_OPERATION: 'invalid_operation',
  INVALID_USER_ID: 'invalid_user_id',
  ORGANIZATION_NOT_FOUND: 'organization_not_found',
  SUBSCRIPTION_ACTIVE_REQUIRED: 'subscription_active_required',
} as const
export type OrganizationErrorCode = ErrorCodeValue<typeof OrganizationErrorCode>

export const OrganizationSettingsErrorCode = {
  CERTIFICATE_EXPIRED: 'certificate_expired',
  CERTIFICATE_FILE_REQUIRED: 'certificate_file_required',
  CERTIFICATE_FILES_INVALID: 'certificate_files_invalid',
  CERTIFICATE_FILES_REQUIRED: 'certificate_files_required',
  CERTIFICATE_FIEL_RFC_MISMATCH: 'certificate_fiel_rfc_mismatch',
  CERTIFICATE_INVALID: 'certificate_invalid',
  CERTIFICATE_NOT_YET_VALID: 'certificate_not_yet_valid',
  CERTIFICATE_PREVIOUS_RFC_MISMATCH: 'certificate_previous_rfc_mismatch',
  CSD_REQUIRED: 'csd_required',
  FIEL_INVALID: 'fiel_invalid',
  FIEL_RFC_MISMATCH: 'fiel_rfc_mismatch',
  FIEL_REQUIRED: 'fiel_required',
  ORGANIZATION_DOMAIN_CHANGE_NOT_ALLOWED:
    'organization_domain_change_not_allowed',
  ORGANIZATION_DOMAIN_UNAVAILABLE: 'organization_domain_unavailable',
  ORGANIZATION_SETTINGS_INVALID: 'organization_settings_invalid',
  ORGANIZATION_SUPPORT_EMAIL_REQUIRED: 'organization_support_email_required',
  ORGANIZATION_TAX_INFO_INVALID: 'organization_tax_info_invalid',
  PRIVATE_KEY_CERTIFICATE_MISMATCH: 'private_key_certificate_mismatch',
  PRIVATE_KEY_FILE_REQUIRED: 'private_key_file_required',
  PRIVATE_KEY_PASSWORD_INCORRECT: 'private_key_password_incorrect',
} as const
export type OrganizationSettingsErrorCode = ErrorCodeValue<
  typeof OrganizationSettingsErrorCode
>

export const OrganizationInviteErrorCode = {
  INVITE_EMAIL_DELIVERY_FAILED: 'invite_email_delivery_failed',
  INVITE_EMAIL_MISMATCH: 'invite_email_mismatch',
  INVITE_EXPIRED: 'invite_expired',
  INVITE_NOT_FOUND: 'invite_not_found',
  INVITE_ROLE_UNAVAILABLE: 'invite_role_unavailable',
  USER_ALREADY_IN_ORGANIZATION: 'user_already_in_organization',
} as const
export type OrganizationInviteErrorCode = ErrorCodeValue<
  typeof OrganizationInviteErrorCode
>

export const OrganizationAccessErrorCode = {
  ORGANIZATION_ADMIN_ACCESS_CANNOT_BE_REMOVED:
    'organization_admin_access_cannot_be_removed',
  ORGANIZATION_ADMIN_ASSIGNMENT_CANNOT_BE_EDITED:
    'organization_admin_assignment_cannot_be_edited',
  ORGANIZATION_ADMIN_ROLE_CANNOT_BE_DELETED:
    'organization_admin_role_cannot_be_deleted',
  ORGANIZATION_ADMIN_ROLE_CANNOT_BE_EDITED:
    'organization_admin_role_cannot_be_edited',
  ORGANIZATION_ADMIN_ROLE_REQUIRED: 'organization_admin_role_required',
  ORGANIZATION_ID_NOT_ALLOWED: 'organization_id_not_allowed',
  ORGANIZATION_ID_REQUIRED: 'organization_id_required',
  OWNER_ACCESS_CANNOT_BE_REASSIGNED: 'owner_access_cannot_be_reassigned',
  OWNER_ACCESS_CANNOT_BE_REMOVED: 'owner_access_cannot_be_removed',
  ROLE_HAS_ASSIGNED_USERS: 'role_has_assigned_users',
  ROLE_TEMPLATE_NOT_FOUND: 'role_template_not_found',
  ROLE_NOT_FOUND: 'role_not_found',
  USER_ACCESS_NOT_FOUND: 'user_access_not_found',
} as const
export type OrganizationAccessErrorCode = ErrorCodeValue<
  typeof OrganizationAccessErrorCode
>

export const OrganizationSeriesErrorCode = {
  SERIES_ALREADY_EXISTS: 'series_already_exists',
  SERIES_NOT_FOUND: 'series_not_found',
} as const
export type OrganizationSeriesErrorCode = ErrorCodeValue<
  typeof OrganizationSeriesErrorCode
>

export const WebhookErrorCode = {
  WEBHOOK_DELIVERY_ATTEMPT_NOT_FOUND: 'webhook_delivery_attempt_not_found',
  WEBHOOK_NOT_FOUND: 'webhook_not_found',
  WEBHOOK_SIGNATURE_INVALID: 'webhook_signature_invalid',
} as const
export type WebhookErrorCode = ErrorCodeValue<typeof WebhookErrorCode>

export const ToolErrorCode = {
  TAX_ID_VALIDATION_FAILED: 'tax_id_validation_failed',
  TAX_ID_VALIDATION_SERVICE_UNAVAILABLE:
    'tax_id_validation_service_unavailable',
} as const
export type ToolErrorCode = ErrorCodeValue<typeof ToolErrorCode>

export type ApiErrorCode =
  | CommonErrorCode
  | AuthErrorCode
  | RequestErrorCode
  | CustomerErrorCode
  | TaxInfoValidationCode
  | ProductErrorCode
  | SupplierErrorCode
  | CatalogErrorCode
  | InvoiceErrorCode
  | InvoiceDraftErrorCode
  | InvoiceStampingErrorCode
  | InvoiceDeliveryErrorCode
  | InvoiceCancellationErrorCode
  | ReceiptErrorCode
  | ReceiptInvoicingErrorCode
  | ReceiptGlobalInvoiceErrorCode
  | RetentionErrorCode
  | RetentionDeliveryErrorCode
  | RetentionCancellationErrorCode
  | RetentionStampingErrorCode
  | OrganizationErrorCode
  | OrganizationSettingsErrorCode
  | OrganizationInviteErrorCode
  | OrganizationAccessErrorCode
  | OrganizationSeriesErrorCode
  | WebhookErrorCode
  | ToolErrorCode

// Public errors[].code constants for Facturapi-owned validation details.
export const ValidationErrorCode = {
  AMOUNT_EXCEEDS_RELATED_DOCUMENT_BALANCE:
    'amount_exceeds_related_document_balance',
  EXCHANGE_RATE_TOO_LARGE: 'exchange_rate_too_large',
  EXCHANGE_RATE_TOO_SMALL: 'exchange_rate_too_small',
  INVALID_FORMAT: 'invalid_format',
  INVALID_LENGTH: 'invalid_length',
  INVALID_TYPE: 'invalid_type',
  NOT_FOUND: 'not_found',
  NOT_ALLOWED: 'not_allowed',
  REQUIRED: 'required',
  TOO_LARGE: 'too_large',
  TOO_SMALL: 'too_small',
  UNKNOWN_FIELD: 'unknown_field',
  INVALID_VALUE: 'invalid_value',
} as const
export type ValidationErrorCode = ErrorCodeValue<typeof ValidationErrorCode>
