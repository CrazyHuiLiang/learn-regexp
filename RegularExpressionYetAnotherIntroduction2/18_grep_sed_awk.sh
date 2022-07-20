# 使用 "serve -p 80" 开启一个本地80服务后，再测试下面的代码

# 提取 HTTP/1.1 200 ok开头的行
curl -si 0.0.0.0:80 | grep "^HTTPS\?\/[.[:digit:]]*[[:space:]]\+[[:digit:]]\{3\}[[:space:]]*[[:alpha:]]*"

# 提取首行
curl -si 0.0.0.0:80  | grep -n '.*' | grep '^1:'
# 提取首行(去掉由grep -n添加的行号）
curl -si 0.0.0.0:80  | grep -n '.*' | grep '^1:' | sed 's/1://'

# 提取首行
curl -si 0.0.0.0:80  | grep -n '.*' | awk '/^1:/ {print $0}'

# 打印首行中包含的的状态码（第二列）
curl -si 0.0.0.0:80  | grep -n '.*' | awk '/^1:/ {print $2}'
curl -si 0.0.0.0:80  | grep -n '.*' | grep '^1:' | sed 's/1://' | awk '/./ {print $2}'
curl -si 0.0.0.0:80  | grep -n '.*' | grep '^1:' | sed 's/1://' | awk '{print $2}'

# 通过cut切分出状态码
curl -si 0.0.0.0:80 | grep "^HTTPS\?\/[.[:digit:]]*[[:space:]]\+[[:digit:]]\{3\}[[:space:]]*[[:alpha:]]*" | cut -f 2 -d ' '

# cut 在分隔符有多个空格时会有问题，会返回空格
echo "HTTP/1.1      200 OK" | cut -f 2 -d ' '
# 使用awk可以更精确的拿到第二列
echo "HTTP/1.1      200 OK" | awk '/./ {print $2}'
