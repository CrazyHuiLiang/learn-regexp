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


    // 使用 ',' 分割3位一组的数字
    test('split-with-comma', () => {
        const numString = '123456789';
        // 将肯定顺序环视替换为一个,
        expect(numString.replace(/(?=(\d{3})+)/g, ',')).toBe(',1,2,3,4,5,6,789');
        // 结合否定顺序环视,让(\d{3})+能匹配右侧的整个数字字符串，而不能只匹配其中的一个子串
        expect(numString.replace(/(?=(\d{3})+(?!\d))/g, ',')).toBe(',123,456,789');
        // 上面的正则在整个字符串最左边也添加了,
        // 严格的说加入,的位置应该是：右侧的数字字符串长度是3的倍数，且左侧也是数字字符，所以还需要加上肯定逆序环视
        expect(numString.replace(/(?<=\d)(?=(\d{3})+(?!\d))/g, ',')).toBe('123,456,789');
    });

    // 去除掉中英文混排文本中，多余的空白字符（中文之间的空白字符，英文单词之间保留空白字符）
    test('remove unnecessary space', () => {
        const mixedString = '中英文混排，some    English word,有多余的空 白字符';
        console.log('[' + mixedString.replace(/(?<![a-zA-Z])\s+(?![a-zA-Z])/g, '') + ']');


        const mixedString2 = '  中英文混排，some    English word,有多余的空 白字符  ';
        // 否定环视要判断成功有两种情况：字符串中出现了字符，但这些字符不能由环视结构中的表达式匹配；或者字符串中不再有任何字符串，也就是说
        // 这个位置是字符串的起始位置或者结束位置
        console.log('[' + mixedString2.replace(/(?<![a-zA-Z])\s+(?![a-zA-Z])/g, '') + ']');
        // 肯定环视要判断成功，字符串中必须有字符由环视结构中的表达式匹配
        // 因此下方表达式没有办法去除掉字符串两端的空白符
        console.log('[' + mixedString2.replace(/(?<=[^a-zA-Z])\s+(?=[^a-zA-Z])/g, '') + ']');
    });

    // 在email中准确的找到主机地址
    test('find host in email', () => {
        const regExp = /^(?=[-a-zA-Z\d.]{0,255}(?![-a-zA-Z\d.]))((?!-)[-a-zA-Z\d]{1,63}\.)*(?!-)[-a-zA-Z\d]{1,63}$/g;
        expect(new RegExp(regExp).test('localhost')).toBeTruthy();
        expect(new RegExp(regExp).test('example.com')).toBeTruthy();
        expect(new RegExp(regExp).test('-example.com')).toBeFalsy();
        expect(new RegExp(regExp).test(Array(64).fill('e').join('') + '.com')).toBeFalsy();
        expect(new RegExp(regExp).test(Array(256).fill('e').join(''))).toBeFalsy();
    })

    /*
        环视的价值
        * 添加限制不影响整个表达式的匹配
        * 提取数据时杜绝错误匹配，一般来说，凡是从文本中提取"有长度特征的数据"，都要用到环视
     */

    // 辅音字母
    test('consonant', () => {
        expect(/[b-df-hj-np-tv-z]/.test('bcd')).toBeTruthy();
        // 使用环视更加清晰：从26个字母中减去5个元音字母
        //    [a-z]真正匹配一个小写字母
        //    环视(?![aeiou])同时要求这个字母不能有 [aeiou] 匹配
        expect(/(?![aeiou])[a-z]/.test('bcd')).toBeTruthy();
    });

    /*
        环视与分组编号
    */
    test('look-around with bracket', () => {
        // 环视结构虽然必须用到括号字符，但这里的括号只是结构需要，并不影响捕获分组
        console.log(/(?!ab)(cd)/.exec('abcd'));
        expect(/(?!ab)(cd)/.exec('abcd')[0]).toBe('cd');
        expect(/(?!ab)(cd)/.exec('abcd')[1]).toBe('cd');

        // 括号有多种用途，比如多选结构，即便括号只表示多选结构，如果没有显式指定为非捕获型括号(?:...),也会被视为捕获型括号，这时候结果就大不一样了
        console.log(/^(?=(ab|cd))/.exec('abcd'));
        console.log(/^(?=(?:ab|cd))/.exec('abcd'));
    });

    /*
        环视的组合

        多个环视可以组合在一起，实现在同一位置的多重判断
     */
    // 最常见的组合是环视中包含环视
    test('contain', () => {

    });
});
