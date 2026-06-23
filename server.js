const http=require("http"),fs=require("fs"),path=require("path");
const root=process.argv[2],port=8000;
const types={".html":"text/html",".css":"text/css",".js":"text/javascript",".png":"image/png",".svg":"image/svg+xml"};
http.createServer((req,res)=>{
  let f=decodeURIComponent(req.url.split("?")[0]);
  if(f==="/")f="/organic-hearth.html";
  const fp=path.join(root,f);
  fs.readFile(fp,(e,d)=>{
    if(e){res.writeHead(404);res.end("404");return;}
    res.writeHead(200,{"Content-Type":types[path.extname(fp)]||"application/octet-stream"});
    res.end(d);
  });
}).listen(port,()=>console.log("listening "+port));
