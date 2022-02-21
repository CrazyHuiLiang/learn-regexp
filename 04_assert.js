l = console.log;
/*
 * 单词边界 \b
 */
console.group('单词边界:\\b');
l('\\brow\\b with row',/\brow\b/.test('row'));
l('\\brow with row',/\brow/.test('row'));
l('row\\b with row',/row\b/.test('row'));
console.groupEnd();

console.group('单词边界:\\b');
l('\\brow\\b with brown',/\brow\b/.test('brown'));
l('\\brow with brown',/\brow/.test('brown'));
l('row\\b with brown',/row\b/.test('brown'));
console.groupEnd();

console.group('单词边界:\\b');
l('\\brow\\b with tomorrow',/\brow\b/.test('tomorrow'));
l('\\brow with tomorrow',/\brow/.test('tomorrow'));
l('row\\b with tomorrow',/row\b/.test('tomorrow'));
console.groupEnd();

console.group('单词边界:\\b');
l('\\brow\\b with rowdy',/\brow\b/.test('rowdy'));
l('\\brow with rowdy',/\brow/.test('rowdy'));
l('row\\b with rowdy',/row\b/.test('rowdy'));
console.groupEnd();

