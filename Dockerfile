# 使用Nginx作为基础镜像
FROM nginx:latest

# 复制您的前端应用文件到Nginx的默认目录
COPY dist /usr/share/nginx/html

# 可选：如果您需要自定义Nginx配置，可以复制配置文件到相应位置
# COPY  /path/to/your/nginx/conf/nginx.conf /etc/nginx/nginx.conf

# 暴露Nginx监听的端口（通常为80）
EXPOSE 80

# 启动Nginx服务	以前台方式启动
CMD ["nginx", "-g", "daemon off;"]
