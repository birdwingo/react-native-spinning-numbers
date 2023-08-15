export const NUMBERS = [ 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1 ].join( '\n' );
export const SIGNS = [ '+', '-', '' ].join( '\n' );
export const NUMBER_RE = /^[0-9]+(\.[0-9]+)?$/;
export const NUMERIC_RE = /^(?<presign>[+-]? *)(?<prefix>[^0-9,.]*)(?<sign>[+-]? *)(?<value>[0-9]([0-9,. ]*?[0-9])*?)(?<suffix>[^0-9,.]*)$/;
export const DECIMAL_SEP_RE = /[0-9](?<separator>[,.])[0-9]+$/;
export const THOUSANDS_SEP_RE = /[0-9](?<separator>[,. ])[0-9]{3}/;
export const DECIMALS_RE = /^[0-9]+/;
export const FRACTIONS_RE = /(\.[0-9]+)?$/;

export const CHARS_TO_MEASURE = 'aáäbcčdďeéfghiíjklľĺmnňoóôpqrŕsštťuúvwxyýzžAÁÄBCČDĎEÉFGHIÍJKLĽĹMNŇOÓÔPQRŔSŠTŤUÚVWXYÝZŽ0123456789 ,.-+$%€!?&@#*';
export const DURATION = 1000;
