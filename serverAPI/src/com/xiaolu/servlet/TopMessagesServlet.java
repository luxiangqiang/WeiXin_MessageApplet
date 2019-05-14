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
 * 功能：设置置顶留言
 * @author Boy Baby
 *
 */
@WebServlet("/TopMessagesServlet")
public class TopMessagesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public TopMessagesServlet() {
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
		String id = jsonobject.getString("id");//用户id
		System.out.println("置顶留言id:"+ id);
		String type = jsonobject.getString("type");//置顶留言标识
		
		if(type.equals("1")){
			String updatesql = "update messages set istop = 1 where p_id = "+id+"";
			
			int count = Tools.executeUpdate(updatesql);
			
			if(count > 0){
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "置顶成功");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}else{
				JSONObject jsonObject2=new JSONObject();
				jsonObject2.put("result", "0");
				jsonObject2.put("msg", "置顶失败");
				String string2=jsonObject2.toString();
				response.getWriter().write(string2);
			}
		}else{
			String updatesql = "update messages set istop = 0 where p_id = "+id+"";
			
			int count = Tools.executeUpdate(updatesql);
			
			if(count > 0){
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "置顶成功");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}else{
				JSONObject jsonObject2=new JSONObject();
				jsonObject2.put("result", "0");
				jsonObject2.put("msg", "置顶失败");
				String string2=jsonObject2.toString();
				response.getWriter().write(string2);
			}
		}	
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
