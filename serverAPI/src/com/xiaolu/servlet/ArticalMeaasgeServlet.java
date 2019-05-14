package com.xiaolu.servlet;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.text.ParseException;
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
 * 功能:上传文章信息
 * @author Boy Baby
 *
 */
@WebServlet("/MessageServlet")
public class ArticalMeaasgeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public ArticalMeaasgeServlet() {
        super();
    }

    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//解决乱码
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		
		//接受数据
		StringBuffer sbJson = new StringBuffer();
		String line = "";
		try{
			//读取网络传输过来的数据
			BufferedReader br = request.getReader();
			//遍历数据并拼接
			while((line = br.readLine())!= null){
				//如果读到数据,把他添加到字符流中  
				sbJson.append(line);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("client json data =" + sbJson);  
		
		
		 // 功能:把读取到的数据封装 JSON
		 
		System.out.println("JSON = "+ sbJson.toString());
		JSONObject jsonobject = JSONObject.fromObject(sbJson.toString());

		String title = jsonobject.getString("title");//标题
		String describ = jsonobject.getString("describe");//描述
		String id = jsonobject.getString("id");//公众号id
		String isheck = jsonobject.getString("isheck");
		System.out.println("文章标识为"+ isheck);
		SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy-MM-dd");
		java.util.Date dates = null;
		Date now = new Date();
		String nows = sdf3.format(now);
		try {
			dates=sdf3.parse(nows);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		if(isheck.equals("0")){
			//插入数据
			String sql="insert into articel(title,describ,date,g_id) values(?,?,?,?)";
			
			int count = Tools.executeUpdate(sql,title,describ,dates,id);
			
			if(count>0){
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "提交文章信息成功");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}else{
				JSONObject jsonObject2=new JSONObject();
				jsonObject2.put("result", "0");
				jsonObject2.put("msg", "提交文章信息失败");
				String string2=jsonObject2.toString();
				response.getWriter().write(string2);
			}
		}else{
			
			String selectSql= "select * from articel where title = '"+title+"' and describ = '"+describ+"'and g_id='"+id+"'";
			List list = Tools.executeQuary(selectSql);
			
			if(list.size()>0){
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "获取文章信息成功");
				jsonObject1.put("content", list);
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}else{
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "获取文章信息失败");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}
		}
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
