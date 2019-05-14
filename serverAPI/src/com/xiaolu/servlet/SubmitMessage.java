package com.xiaolu.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaolu.dao.Tools;

import net.sf.json.JSONObject;

/**
 * 功能：接受用户留言并插入到缓存表中等待作者审核
 * @author Boy Baby
 *
 */
@WebServlet("/SubmitMessage")
public class SubmitMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public SubmitMessage() {
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

		String g_id = jsonobject.getString("g_id");//公众号标号
		String no = jsonobject.getString("no");//文章编号
		String username = jsonobject.getString("username");//用户名
		String title = jsonobject.getString("title");//标题
		String headimage = jsonobject.getString("avatarUrl");//用户头像
		String messages = jsonobject.getString("messages");//留言内容
		String openid = jsonobject.getString("openid");//留言openid
		String token = jsonobject.getString("token");
		String ischeck = jsonobject.getString("ischeck");//是否公开form_id
		String fromid = jsonobject.getString("form_id");//留言form_id
		System.out.println(username);
		String insertsql = "insert into messages(no,title,username,headimage,userMesContent,isCheck,openid,g_id,fromid,token) values(?,?,?,?,?,?,?,?,?,?)";
		
		int count = Tools.executeUpdate(insertsql, no,title,username,headimage,messages,ischeck,openid,g_id,fromid,token);
		
		if(count>0){          
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("message", messages);
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
		}else{
			JSONObject jsonObject2=new JSONObject();
			jsonObject2.put("result", "0");
			jsonObject2.put("msg", "提交失败");
			String string2=jsonObject2.toString();
			response.getWriter().write(string2);
		}
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
