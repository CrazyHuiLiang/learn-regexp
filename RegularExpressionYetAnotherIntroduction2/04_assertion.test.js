/*
    断言（assertion）：有些结构并不真正匹配文本，而只负责判断在某个位置左/右侧的文本是否符合要求，这种结构被称为断言。
        常见的断言有三类：单词边界、行起始/结束位置、环视。
 */

/*
    单词边界（word boundary）：记为\b，它匹配的是"单词边界"位置，而不是字符。这类匹配位置的元素叫作锚点(anchor)，它用来"定位"到某个位置。
        也就是说，\b能够匹配这样的位置：一边是单词字符，另一边不是单词字符

    1. 单词边界并不区分左右，在"单词边界"上，可能只有左侧是单词字符，也可能只有右侧是单词字符，总的来说，单词字符只能出现在一侧；
    2. 单词字符要求"另一边不是单词字符"，而不是"另一边的字符不是单词字符"，
        也就是说，一边必须出现单词字符，另一边可以出现非单词字符，也可能没有任何字符。
        一般情况下，"单词字符"的解释是\w能匹配的字符（[0-9a-zA-Z]）。

    与单词边界\b对应的还有非单词边界\B,匹配\b不能匹配的情况
 */
describe('word boundary', () => {
    test('english word', () => {
        expect('Hello world!'.match(/\b\w+\b/g)).toContain('Hello');
    });
});

/*
    行起始/结束位置
 */
describe('^ and $', () => {
    /*
        ^能匹配整个字符串的起始位置，在某些情况下，^也可以匹配字符串内部的"行起始位置"

        如果把匹配模式设置为多行模式（Multiline Mode）下，^就既可以匹配整个字符串的起始位置，也可以匹配换行符之后的位置
     */
    test('^', () => {
        const regexp = /^\w+/mg;
        const string = 'first line\nsecond line\r\n\rlast line';
        expect(regexp.exec(string)).toContain('first');
        expect(regexp.exec(string)).toContain('second');
        expect(regexp.exec(string)).toContain('last');
    });

    /*
        $匹配的同样是位置。通常它匹配的是整个字符串的结尾位置
            如果最后是行终止符，则匹配行终止符之前的位置；(JavaScript中的$，只能匹配字符串/行的结束位置，通过下方第二个例子验证，在JavaScript中，会匹配失败)
            否则匹配最后一个字符之后的位置

        如果指定多行模式，$会匹配每个行终止符之前的位置
        最后一行比较特殊：
            如果最后一行没有终止符，则匹配字符串结尾位置；
            否则，陪陪行终止符之前的位置
     */
    test('$', () => {
        expect(/\w+$/.exec('Some sample text')).toContain('text');
        expect(/\w+$/.exec('Some sample text\n')).toBeNull();

        const regexp = /\w+$/mg;
        const string = 'first line\nsecond line\r\n\rlast line';
        expect(regexp.exec(string)).toContain('line');
        expect(regexp.exec(string)).toContain('line');
        expect(regexp.exec(string)).toContain('line');

        const regexp2 = /\w+$/mg;
        const string2 = 'first line\nsecond line\r\n\rlast line\n';
        expect(regexp2.exec(string2)).toContain('line');
        expect(regexp2.exec(string2)).toContain('line');
        expect(regexp2.exec(string2)).toContain('line');
    });

    test('replace', () => {
        let text = "line1\nline2\nline3";

        /*
            ^ 和 $的另一个特点是，进行正则表达式替换时并不会被替换。
                也就是说在起始/结束位置进行替换，只会在起始/结束位置添加一些字符，位置本身仍然存在
         */
        // 为每行文笔添加 <p></p>
        expect(text
            .replace(/$/mg, '</p>')
            .replace(/^/mg, '<p>')
        ).toBe('<p>line1</p>\n<p>line2</p>\n<p>line3</p>');

        /*
            使用 ^ 和 $在多行模式下，可以删除每行首尾的多余空白字符
         */
        let withSpace = '    begin\n between\t\n\nend';
        // 因为 \s 匹配的空白符中包含换行符 \n, 所以完全是空白符的第3行（连同换行符）也被删掉了。
        expect(withSpace
            .replace(/^\s+/gm, '')
            .replace(/\s+$/gm, '')
        ).toBe('begin\nbetween\nend');


        /*
            我们用多选结构合并多个表达式时，一定要小心未曾预期的后果；有时候，分几步进行反而能省去许多麻烦
         */
        // 当我们使用这个多选结构时可以发现，不但第3行被删除了，第二行和第四行也合并一行了，因为\s+$中的\s可以匹配\t\n，同样^\s+可以匹配\n
            // 所以\t\n\n经过两步被彻底删除了。
        expect(withSpace.replace(/(^\s+|\s+$)/mg, '')).toBe('begin\nbetweenend');
    });
});

/*
    环视：用来"停在原地，四处张望"。环视类似单词边界，在它旁边的文本需要满足某种条件，而且本身不匹配任何字符
        (?=...)  肯定顺序环视的记法，表示?=右侧出现...
        (?!...)  否定顺序环视的记法，表示?!右侧不能出现...
        (?<=...) 肯定逆序环视的记法，表示?<=左侧出现...
        (?<!...) 否定逆序环视的记法，表示?<!左侧不能出现...
 */
describe('look-around', () => {
    // open tag
    /*
        <(?!/)    ('[^']*'"[^"]*"[^'">])+    (?<!/)?>
        <         tag content...                    >
     */
    test('open_tag', () => {
        const openTagRegex = new RegExp(`^<(?!/)('[^']*'|"[^"]*"|[^'">])+(?<!/)>$`);
        expect(openTagRegex.test(`<input name=txt value=">\">`)).toBeTruthy();
        expect(openTagRegex.test(`<input name=txt value='>'>`)).toBeTruthy();
        expect(openTagRegex.test(`<u>`)).toBeTruthy();
        expect(openTagRegex.test(`<br/>`)).toBeFalsy();
        expect(openTagRegex.test(`<img src="url" />`)).toBeFalsy();
    });
});
