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
 * 功能:精选留言和删除留言
 * @author Boy Baby
 *
 */
@WebServlet("/ChooseDeleteMessage")
public class ChooseDeleteMessage extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
 
    public ChooseDeleteMessage() {
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
		String type = jsonobject.getString("type");// 精选/删除留言标识
		
		if(type.equals("1")){
			//设置为精选留言
			String updatesql = "update messages set isCheck = 1 where p_id = "+id+"";
			
			int count = Tools.executeUpdate(updatesql);
			if(count>0){
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "已设置为精选留言");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}else{
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "0");
				jsonObject1.put("msg", "设置为精选留言失败");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}
		}else if(type.equals("0")){
			//删除留言
			String deletesql = "delete from messages where p_id = "+id+"";
			
			int count = Tools.executeUpdate(deletesql);
			if(count>0){
				String deletesql1 = "delete from zan where p_id = "+id+"";
				int count1 = Tools.executeUpdate(deletesql1);
				if(count1>=0){
					JSONObject jsonObject1=new JSONObject();
					jsonObject1.put("result", "1");
					jsonObject1.put("msg", "已删除该留言");
					String string = jsonObject1.toString();
					System.out.println(string);
					response.getWriter().write(string);
				}else{
					JSONObject jsonObject1=new JSONObject();
					jsonObject1.put("result", "0");
					jsonObject1.put("msg", "删除该留言失败");
					String string = jsonObject1.toString();
					System.out.println(string);
					response.getWriter().write(string);
				}
			}else{
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "0");
				jsonObject1.put("msg", "删除该留言失败");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}
		}else{
			//设置为精选留言
			String updatesql = "update messages set isCheck = 0 where p_id = "+id+"";
			
			int count = Tools.executeUpdate(updatesql);
			if(count>0){
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "已取消为精选留言");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}else{
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "0");
				jsonObject1.put("msg", "取消精选留言失败");
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
