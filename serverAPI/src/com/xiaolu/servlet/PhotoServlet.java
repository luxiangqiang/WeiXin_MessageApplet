package com.xiaolu.servlet;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.FileUploadBase.FileSizeLimitExceededException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.xiaolu.dao.Tools;

import net.sf.json.JSONObject;

/**
 * Servlet implementation class PhotoServlet
 */

@WebServlet("/PhotoServlet")
public class PhotoServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//解决乱码
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		
		//保存路径
		String savePath = request.getSession().getServletContext().getRealPath("/")+"photo/";
		System.out.println("路径:"+savePath);
		//通过将给定路径名字符串转换为抽象路径名来创建一个新 File 实例。
		File saveDir=new File(savePath);
		//如果目录不存在就创建目录
		if(!saveDir.exists()){
			saveDir.mkdir();
		}
		//创建文件上传核心类,创建磁盘文件工厂
		DiskFileItemFactory factory=new DiskFileItemFactory();
		//创建阿帕奇文件上传核心类
		ServletFileUpload sfu=new ServletFileUpload(factory);
		
		//设置解析到的文件名编码格式 
		sfu.setHeaderEncoding("utf-8");
		
		try {
			//处理表单请求,解析request为一个集合，元素为FileItem
			List<FileItem>itemList=sfu.parseRequest(request);
			for(FileItem fileItem:itemList){
				//对应表单中控件的name
				String filedName=fileItem.getFieldName();
				System.out.println("控件名称"+filedName);
				//判断是否文件，结果为“true”就是普通表单，如果为“false”则是文件
				if(fileItem.isFormField()){
					//控件值
					String value=fileItem.getString();
					//重新编码,解决fileupload乱码
					value=new String(value.getBytes("iso-8859-1"),"utf-8");
					System.out.println("普通"+filedName+"="+value);
					//上传文件
				}
				else{
					//获得文件大小
					Long size=fileItem.getSize();
					//创建时间戳保证上传文件的唯一性
					String filetype=".jpg";
					Date date=new Date(System.currentTimeMillis());
					SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
					
					//获得上传文件的文件名
					String fileName=fileItem.getName();
					System.out.println("文件名:"+fileName+"\t大小"+size+"byte");
					//设置不允许上传的文件格式
					if(fileName.endsWith(".exe")){
						request.setAttribute("msg", "不允许上传的类型");
						JSONObject jsonObject1=new JSONObject();
						jsonObject1.put("result", "0");
						jsonObject1.put("msg", "上传失败");
						String string1=jsonObject1.toString();
						response.getWriter().write(string1);
					}
					else{
						//将文件保存到指定路径
						File file=new File(savePath,fileName);
						try {
							fileItem.write(file);
							//更新路径  （例如：https://你的域名/Message_board/photo/）
							String basepath="你的服务器的存储照片的路径"+fileName;
							String paths = basepath.replace("\\", "\\\\");
							System.out.println("完整路径"+paths);
							String updatesql="UPDATE articel set imageTitle='"+paths+"' order by `no` desc limit 1";
							int executeUpdate = Tools.executeUpdate(updatesql);
							if(executeUpdate>0)
							{
								JSONObject jsonObject1=new JSONObject();
								jsonObject1.put("result", "1");
								jsonObject1.put("msg", "插入成功");
								String string=jsonObject1.toString();
								System.out.println(string);
								response.getWriter().write(string);
							}
							else
							{
								JSONObject jsonObject2=new JSONObject();
								jsonObject2.put("result", "0");
								jsonObject2.put("msg", "插入失败");
								String string2=jsonObject2.toString();
								response.getWriter().write(string2);
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
				}
			}
		}catch(FileSizeLimitExceededException e){
			request.setAttribute("msg", "文件太大");
		}
		catch (FileUploadException e) {
			e.printStackTrace();
		}catch(Exception e){
			e.printStackTrace();
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
