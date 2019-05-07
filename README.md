# foodMappingTool

python版本是3.6及以上

需要修改的主要是backend/lib/all_data.py

使用的数据详见各个类的定义及文档说明，都在backend/lib/save文件夹下了

注释和文档很粗略，遇到任何代码含义不清楚的地方，及时问我，避免影响进度

大家加油！

# 2019.05.07更新

目前除了同义词添加修改、冲突检测之外，其他功能基本完成。请各位协助测试各项功能，使用过程中顺便自查代码是否有bug。

网址：详见微信群。

内测阶段，数据操作请随意，不必担心恢复问题，如遇连不上或是报错崩溃的情况，及时与我联系。

如发现bug，且需要前后端联调，则按照以下步骤在本机运行程序：

1. 安装nodejs

2. 切换到frontend目录

3. windows操作系统用package_windows.json替换package.json，linux系统用package_linux.json替换package.json

4. 命令行运行npm install

5. 命令行运行npm run build（如果失败，需要确保backend下有static和templates两个文件夹，没有则手动创建，重新build）

6. 回到项目根目录，python run.py

7. 打开浏览器，输入localhost:5005即可访问

8. debug时无需停止程序，直接修改后端代码，浏览器中会实时改变，也可自行断点调试。如发现前端bug，与我联系。
