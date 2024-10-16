'use strict';

var conventions = require('./conventions');

/**
 * @param {new (...args: any[]) => object} constructor
 * @param {boolean} [writableName]
 * @returns {void}
 */
function extendError(constructor, writableName) {
	constructor.prototype = Object.create(Error.prototype, {
		constructor: { value: constructor },
		name: { value: constructor.name, enumerable: true, writable: writableName },
	});
}

var DOMExceptionName = conventions.freeze(/** @type {const} */ ({
	/**
	 * the default value as defined by the spec
	 */
	Error: 'Error',
	/**
	 * @deprecated
	 * Use RangeError instead.
	 */
	IndexSizeError: 'IndexSizeError',
	/**
	 * @deprecated
	 * Just to match the related static code, not part of the spec.
	 */
	DomstringSizeError: 'DomstringSizeError',
	HierarchyRequestError: 'HierarchyRequestError',
	WrongDocumentError: 'WrongDocumentError',
	InvalidCharacterError: 'InvalidCharacterError',
	/**
	 * @deprecated
	 * Just to match the related static code, not part of the spec.
	 */
	NoDataAllowedError: 'NoDataAllowedError',
	NoModificationAllowedError: 'NoModificationAllowedError',
	NotFoundError: 'NotFoundError',
	NotSupportedError: 'NotSupportedError',
	InUseAttributeError: 'InUseAttributeError',
	InvalidStateError: 'InvalidStateError',
	SyntaxError: 'SyntaxError',
	InvalidModificationError: 'InvalidModificationError',
	NamespaceError: 'NamespaceError',
	/**
	 * @deprecated
	 * Use TypeError for invalid arguments,
	 * "NotSupportedError" DOMException for unsupported operations,
	 * and "NotAllowedError" DOMException for denied requests instead.
	 */
	InvalidAccessError: 'InvalidAccessError',
	/**
	 * @deprecated
	 * Just to match the related static code, not part of the spec.
	 */
	ValidationError: 'ValidationError',
	/**
	 * @deprecated
	 * Use TypeError instead.
	 */
	TypeMismatchError: 'TypeMismatchError',
	SecurityError: 'SecurityError',
	NetworkError: 'NetworkError',
	AbortError: 'AbortError',
	/**
	 * @deprecated
	 * Just to match the related static code, not part of the spec.
	 */
	URLMismatchError: 'URLMismatchError',
	QuotaExceededError: 'QuotaExceededError',
	TimeoutError: 'TimeoutError',
	InvalidNodeTypeError: 'InvalidNodeTypeError',
	DataCloneError: 'DataCloneError',
	EncodingError: 'EncodingError',
	NotReadableError: 'NotReadableError',
	UnknownError: 'UnknownError',
	ConstraintError: 'ConstraintError',
	DataError: 'DataError',
	TransactionInactiveError: 'TransactionInactiveError',
	ReadOnlyError: 'ReadOnlyError',
	VersionError: 'VersionError',
	OperationError: 'OperationError',
	NotAllowedError: 'NotAllowedError',
	OptOutError: 'OptOutError',
}));
var DOMExceptionNames = Object.keys(DOMExceptionName);

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isValidDomExceptionCode(value) {
	return typeof value === 'number' && value >= 1 && value <= 25;
}
/**
 * @param {string | Error | undefined} value
 * @returns {boolean}
 */
function endsWithError(value) {
	return typeof value === 'string' && value.substring(value.length - DOMExceptionName.Error.length) === DOMExceptionName.Error;
}
/**
 * DOM operations only raise exceptions in "exceptional" circumstances, i.e., when an operation
 * is impossible to perform (either for logical reasons, because data is lost, or because the
 * implementation has become unstable). In general, DOM methods return specific error values in
 * ordinary processing situations, such as out-of-bound errors when using NodeList.
 *
 * Implementations should raise other exceptions under other circumstances. For example,
 * implementations should raise an implementation-dependent exception if a null argument is
 * passed when null was not expected.
 *
 * This implementation supports the following usages:
 * 1. according to the living standard (both arguments are optional):
 * ```
 * new DOMException("message (can be empty)", DOMExceptionNames.HierarchyRequestError)
 * ```
 * 2. according to previous xmldom implementation (only the first argument is required):
 * ```
 * new DOMException(DOMException.HIERARCHY_REQUEST_ERR, "optional message")
 * ```
 * both result in the proper name being set.
 *
 * @class DOMException
 * @param {number | string} messageOrCode
 * The reason why an operation is not acceptable.
 * If it is a number, it is used to determine the `name`, see
 * {@link https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-258A00AF ExceptionCode}
 * @param {string | keyof typeof DOMExceptionName | Error} [nameOrMessage]
 * The `name` to use for the error.
 * If `messageOrCode` is a number, this arguments is used as the `message` instead.
 * @augments Error
 * @see https://webidl.spec.whatwg.org/#idl-DOMException
 * @see https://webidl.spec.whatwg.org/#dfn-error-names-table
 * @see https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-17189187
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 */
function
	// @ts-expect-error - augments
	DOMException(messageOrCode, nameOrMessage) {
	// support old way of passing arguments: first argument is a valid number
	if (isValidDomExceptionCode(messageOrCode)) {
		this.name = DOMExceptionNames[messageOrCode];
		this.message = nameOrMessage || '';
	} else {
		this.message = messageOrCode;
		this.name = endsWithError(nameOrMessage) ? nameOrMessage : DOMExceptionName.Error;
	}
	if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
}
extendError(DOMException, true);
Object.defineProperties(DOMException.prototype, {
	code: {
		enumerable: true,
		get: function () {
			var code = DOMExceptionNames.indexOf(this.name);
			if (isValidDomExceptionCode(code)) return code;
			return 0;
		},
	},
});

var ExceptionCode = /** @type {const} */ ({
	INDEX_SIZE_ERR: 1,
	DOMSTRING_SIZE_ERR: 2,
	HIERARCHY_REQUEST_ERR: 3,
	WRONG_DOCUMENT_ERR: 4,
	INVALID_CHARACTER_ERR: 5,
	NO_DATA_ALLOWED_ERR: 6,
	NO_MODIFICATION_ALLOWED_ERR: 7,
	NOT_FOUND_ERR: 8,
	NOT_SUPPORTED_ERR: 9,
	INUSE_ATTRIBUTE_ERR: 10,
	INVALID_STATE_ERR: 11,
	SYNTAX_ERR: 12,
	INVALID_MODIFICATION_ERR: 13,
	NAMESPACE_ERR: 14,
	INVALID_ACCESS_ERR: 15,
	VALIDATION_ERR: 16,
	TYPE_MISMATCH_ERR: 17,
	SECURITY_ERR: 18,
	NETWORK_ERR: 19,
	ABORT_ERR: 20,
	URL_MISMATCH_ERR: 21,
	QUOTA_EXCEEDED_ERR: 22,
	TIMEOUT_ERR: 23,
	INVALID_NODE_TYPE_ERR: 24,
	DATA_CLONE_ERR: 25,
});

// var entries = Object.entries(ExceptionCode);
// for (var i = 0; i < entries.length; i++) {
// 	var key = /** @type {keyof typeof ExceptionCode} */ (/** @type {NonNullable<typeof entries[number]>} */ (entries[i])[0]);
// 	// @ts-expect-error - indexing typings :)
// 	DOMException[key] = /** @type {typeof ExceptionCode[key]} */ (/** @type {NonNullable<typeof entries[number]>} */ (entries[i])[1]);
// }

DOMException.INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR;
DOMException.DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR;
DOMException.HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR;
DOMException.WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR;
DOMException.INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR;
DOMException.NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR;
DOMException.NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR;
DOMException.NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR;
DOMException.NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR;
DOMException.INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR;
DOMException.INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR;
DOMException.SYNTAX_ERR = ExceptionCode.SYNTAX_ERR;
DOMException.INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR;
DOMException.NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR;
DOMException.INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR;
DOMException.VALIDATION_ERR = ExceptionCode.VALIDATION_ERR;
DOMException.TYPE_MISMATCH_ERR = ExceptionCode.TYPE_MISMATCH_ERR;
DOMException.SECURITY_ERR = ExceptionCode.SECURITY_ERR;
DOMException.NETWORK_ERR = ExceptionCode.NETWORK_ERR;
DOMException.ABORT_ERR = ExceptionCode.ABORT_ERR;
DOMException.URL_MISMATCH_ERR = ExceptionCode.URL_MISMATCH_ERR;
DOMException.QUOTA_EXCEEDED_ERR = ExceptionCode.QUOTA_EXCEEDED_ERR;
DOMException.TIMEOUT_ERR = ExceptionCode.TIMEOUT_ERR;
DOMException.INVALID_NODE_TYPE_ERR = ExceptionCode.INVALID_NODE_TYPE_ERR;
DOMException.DATA_CLONE_ERR = ExceptionCode.DATA_CLONE_ERR;

/**
 * Creates an error that will not be caught by XMLReader aka the SAX parser.
 *
 * @class
 * @param {string} message
 * @param {any} [locator]
 */
function ParseError(message, locator) {
	this.message = message;
	this.locator = locator;
	if (Error.captureStackTrace) Error.captureStackTrace(this, ParseError);
}
extendError(ParseError);

exports.DOMException = DOMException;
exports.DOMExceptionName = DOMExceptionName;
exports.ExceptionCode = ExceptionCode;
exports.ParseError = ParseError;
