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
 * 功能:获取管理员的openid
 * @author Boy Baby
 *
 */
@WebServlet("/GetOpertorOpenidServlet")
public class GetOpertorOpenidServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       

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
		String token = jsonobject.getString("token");
		String id = jsonobject.getString("id");
		String formid = jsonobject.getString("formid");
		String openid = jsonobject.getString("openid");
		
		String updateOpenid = "Update gonginfo set fromid = '"+formid+"',token='"+token+"',openid='"+openid+"' where id = "+id+"";
		
		int count = Tools.executeUpdate(updateOpenid);
		
		if(count>0){
			JSONObject jsonObject2 = new JSONObject();
			jsonObject2.put("result", "1");
			String str = jsonObject2.toString();
			System.out.print("更改成功！");
			response.getWriter().write(str);	
		}else{
			JSONObject jsonObject2 = new JSONObject();
			jsonObject2.put("result", "0");
			String str = jsonObject2.toString();
			System.out.print("更改失败！");
			response.getWriter().write(str);	
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		doGet(request, response);
	}

}
