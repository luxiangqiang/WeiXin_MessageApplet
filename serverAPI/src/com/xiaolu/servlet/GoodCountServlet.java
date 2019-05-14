package com.xiaolu.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaolu.dao.Tools;

import net.sf.json.JSONObject;

/**
 * 功能：设置留言点赞数
 * @author Boy Baby
 *
 */
@WebServlet("/GoodCountServlet")
public class GoodCountServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
  
    public GoodCountServlet() {
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
		String status = jsonobject.getString("status");//取消还是点赞
		String p_id = jsonobject.getString("p_id");//留言id
		String g_id = jsonobject.getString("g_id");//公众号d
		String no = jsonobject.getString("no");//文章id
		String openid = jsonobject.getString("openid");//点赞用户openid
		
		if(status.equals("1")){
			//获得一个赞
	
			String insertzan = "insert into zan(g_id,no,p_id,openid,status) values(?,?,?,?,?)";
			int count = Tools.executeUpdate(insertzan,g_id,no,p_id,openid,1);
			
			if(count>0){
				String updateZanCounts = "update messages set zanCounts=zanCounts + 1 where g_id="+g_id+" and no="+no+" and p_id='"+p_id+"'";
				int count1 = Tools.executeUpdate(updateZanCounts);
				if(count1>0){
					JSONObject jsonObject1=new JSONObject();
					jsonObject1.put("result", "1");
					jsonObject1.put("msg", "点赞成功");
					String string = jsonObject1.toString();
					System.out.println(string);
					response.getWriter().write(string);
				}else{
					JSONObject jsonObject1=new JSONObject();
					jsonObject1.put("result", "0");
					jsonObject1.put("msg", "点赞失败");
					String string = jsonObject1.toString();
					System.out.println(string);
					response.getWriter().write(string);
				}
			}else{
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "0");
				jsonObject1.put("msg", "点赞失败");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}
					
		}else{
			//取消一个赞
			String updatesql = "delete from zan where g_id="+g_id+" and no="+no+" and p_id="+p_id+" and openid='"+openid+"'";

			int count = Tools.executeUpdate(updatesql);
			
			if(count>0){
				JSONObject jsonObject1=new JSONObject();
				jsonObject1.put("result", "1");
				jsonObject1.put("msg", "取赞状态成功");
				String string = jsonObject1.toString();
				System.out.println(string);
				response.getWriter().write(string);
			}
			else{
				JSONObject jsonObject2=new JSONObject();
				jsonObject2.put("result", "0");
				jsonObject2.put("msg", "取赞失败");
				String string2=jsonObject2.toString();
				response.getWriter().write(string2);
			}
		}
	}

	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
