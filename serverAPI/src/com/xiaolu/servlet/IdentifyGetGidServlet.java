package com.xiaolu.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaolu.dao.Tools;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 功能:后台用户获取公众号密码
 * @author Boy Baby
 *
 */
@WebServlet("/IdentifyGetGidServlet")
public class IdentifyGetGidServlet extends HttpServlet {
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
		String password = jsonobject.getString("password");
		
		String querySql = "select * from gonginfo where password = '"+password+"'";
		
		List list = Tools.executeQuary(querySql);
		System.out.print("查询成功"+list);
		if(list.size()>0){
			JSONObject jsonObject2 = new JSONObject();
			JSONArray ll=JSONArray.fromObject(list);
			jsonObject2.put("result", "1");
			jsonObject2.put("content", ll);
			String str = jsonObject2.toString();
			System.out.print("查询成功"+str);
			response.getWriter().write(str);	
		}else{
			JSONObject jsonObject2 = new JSONObject();
			JSONArray ll=JSONArray.fromObject(list);
			jsonObject2.put("content", ll);
			jsonObject2.put("result", "0");
			String str = jsonObject2.toString();
			System.out.print("查询失败"+str);
			response.getWriter().write(str);	
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
