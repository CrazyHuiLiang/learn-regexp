/*
    量词
 */

// 不使用量词时，针对下面这种情况，就比较繁琐
test('6个数字', () => {
    expect(/^\d\d\d\d\d\d$/.test('123456')).toBeTruthy();
});

describe('一般形式', () => {
    /*
        {n} 之前的元素必须出现n次
     */
    test('6个数字: {6}', () => {
        expect(/^\d{6}$/.test('123456')).toBeTruthy();
    });
    /*
        量词可以表示不确定的长度，其通用形式是{m,n},其中m和n是两个数字（逗号之后不能有空格）
        他限定之前的元素能够出现的次数，m是下限，n是上限，（均为闭区间）；上限最大为65536，下限最小为0
     */
    test('4~6个数字: {4,6}', () => {
        expect(/^\d{4,6}$/.test('123')).toBeFalsy();
        expect(/^\d{4,6}$/.test('1234')).toBeTruthy();
        expect(/^\d{4,6}$/.test('12345')).toBeTruthy();
        expect(/^\d{4,6}$/.test('123456')).toBeTruthy();
        expect(/^\d{4,6}$/.test('1234567')).toBeFalsy();
    });
    /*
        如果不确定长度上限，可以只指定下限写成{m,}
     */
    test('最少4个数字: {4,}', () => {
        expect(/^\d{4,}$/.test('123')).toBeFalsy();
        expect(/^\d{4,}$/.test('1234')).toBeTruthy();
        expect(/^\d{4,}$/.test('12345')).toBeTruthy();
    });
    /*
        量词一般都有明确的下限，如果没有，默认为0，js也不支持省却下限的写法，使用其他支持省却下限写法的语言时也推荐使用{0,n}的写法
     */
    test('最多4个数字: {4,}', () => {
        expect(/^\d{0,4}$/.test('123')).toBeTruthy();
        expect(/^\d{0,4}$/.test('1234')).toBeTruthy();
        expect(/^\d{0,4}$/.test('12345')).toBeFalsy();
    });
});

/*
    有3个常用量词，他们的形态不同于{m,n},功能确实相同的，可以理解成"量词简记法"
    * 可能出现，也可能不出现，出现次数没有上限  {0,}
    + 至少出现1次，出现次数没有上限
    ? 至多出现1次，也可能不出现
 */
describe('常用量词', () => {
    test('traveler or traveller', () => {
        expect(/^travell?er$/.test('traveler')).toBeTruthy();
        expect(/^travell?er$/.test('traveller')).toBeTruthy();
    });

    // html的tag形式： 从 < 开始，到>结束，<和>之间有若干字符（长度不确定，但不可为0），也不能是>字符。
    // 匹配所有tag需要用
    //    < 匹配开头的 <
    //    > 匹配结尾的 >
    //    [^>]+ 匹配中间的若干字符
    //      /^<[^>]+>$/
    test('html tag', () => {
        expect(/^<[^>]+>$/.test('<bold>')).toBeTruthy();
        expect(/^<[^>]+>$/.test('</table>')).toBeTruthy();
        expect(/^<[^>]+>$/.test('<>')).toBeFalsy();
    });

    // 匹配双引号，引号中间可以有字符，也可以没有字符
    test('quotation mark', () => {
        expect(/^"[^"]*"$/.test('""')).toBeTruthy();
        expect(/^"[^"]*"$/.test('"abcd"')).toBeTruthy();
    });

    // open tag 的特点是<开头，然后是"若干字符"（但不能以/开头），最后是>
    //    ^<[^/][^>]*>$
    //    [^/] 必须匹配一个字符，所以若干字符的其他部分必须写成[^>]*，否则无法匹配名字为单个字符的标签，比如 <b>

    // close tag 的特点是<开头，之后是/字符，然后是"若干字符（不能以/开头）"，最后是>
    //  ^</[^>]+>$

    // self-closing tag的特点是以<开头，中间是"若干字符"，最后是/>
    // ^<[^>]+/>$
    // 注意这里不是 <[^>/]+/>,排除字符组只排除>,而不排除/,如果要求tag内部不能出现/,就无法匹配<img src="http://xx/xx/x.jpg" /> 这类tag了
});

describe('数据提取', () => {
    // 在js中，正则表达式提供 exec 方法，可以在字符串中捕获匹配表达式的内容
    // 表达式后设置g（全局模式），多次执行会对字符串依次向后查找
    test('exec', () => {
        let regexp = /\d{6}/g;
        let string = 'zipcode1:201003,zipcode2:100859';
        expect(regexp.exec(string)).toContain('201003');
        expect(regexp.exec(string)).toContain('100859');
    });
});

/*
    点号可以匹配"任意字符"，常见的数字、字母、各种符号
        有一个不能由点号匹配的就是换行符\n
 */
describe('.号', () => {
    test('', () => {
        expect(/^.$/.test('a')).toBeTruthy();
        expect(/^.$/.test('0')).toBeTruthy();
        expect(/^.$/.test('*')).toBeTruthy();

        expect(/^.$/.test('\n')).toBeFalsy();
        expect(/^[^.]$/.test('\n')).toBeTruthy();
        expect(/^[\s\S]$/.test('\n')).toBeTruthy();
    });
});

/*
    匹配优先量词（greedy quantifier，也称 贪婪量词）：在拿不准是否要匹配的时候，优先尝试匹配，并且记下这个状态，以备将来"反悔",这个反悔的过程专业术语叫作回溯。
        以上的量词都是匹配优先量词
 */
// 详细匹配过程的演示见：书中24页
describe('匹配优先量词', () => {
    test('使用".*",匹配""及其内部字符', () => {
        expect(/".*"/.exec(`"quoted string" and another"`)).toContain('"quoted string" and another"');
    });
    test('使用"[^"]*",精确匹配""及其内部字符', () => {
        expect(/"[^"]*"/.exec(`"quoted string" and another"`)).toContain('"quoted string"');
    });
});

/*
    忽略优先量词（lazy quantifier 或 reluctant quantifier),如果不确定是否要匹配，忽略优先量词会选择"不匹配"的状态，
    再尝试表达式中之后的元素，如果尝试失败，在回溯，选择之前保存的"匹配"的状态。

    匹配优先量词与忽略优先量词逐一对应，只是在对应的匹配优先量词之后添加?，对于[\s\S]*来说，把*改为*?就是使用了忽略优先量词
    两者限定的元素能出现的次数也一样，遇到不能匹配的情况同样需要回溯；唯一的区别在于，忽略优先量词会优先选择"忽略"，而匹配优先量词会优先选择"匹配"

    匹配优先量词只需要考虑自己限定的元素能否匹配即可，而忽略优先量词必须兼顾它所限定的元素与之后的元素，效率自然大大降低，如果字符串很长，两则的速度可能有明显的差异。
 */
describe('忽略优先', () => {

    test('', () => {
        let regexp  = /<script type="test\/javascript">[\s\S]*?<\/script>/; // 忽略优先
        let regexp2 = /<script type="test\/javascript">[\s\S]*<\/script>/; // 捕获优先
        let html = `
        <script type="test/javascript">alert(1);</script>
        <br />
        <script type="test/javascript">alert(2);</script>
        `.trim();
        expect(regexp.exec(html)).toContain(`<script type="test/javascript">alert(1);</script>`);
        expect(regexp2.exec(html)).toContain(html);
    });
});

/*
    正则表达式只能进行纯粹的文本处理，单纯依靠它不能整理出层次结构：如果希望解析文本的同时构建层次结构信息，则必须将正则表达式配合程序代码一起使用。
 */

/*
    量词的转义
    量词     转义后的形式
    +       \+
    *       \*
    ?       \?
    {m,n}   \{m,n}

    +?      \+\?
    *?      \*\?
    ??      \?\?

    忽略优先量词转义时需要将两个量词全部转义，比如如果要匹配*?，正则表达式就必须写作\*\?，而不是 \*?，因为后者的意思是 "*这个字符可能出现，也可能不出现"
 */
