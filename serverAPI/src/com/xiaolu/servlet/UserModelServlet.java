package com.xiaolu.servlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.xiaolu.ThreadGetdata.TokenThread;
import com.xiaolu.dao.Tools;
import com.xiaolu.util.HttpUtil;

import net.sf.json.JSONObject;

/**
 * 功能:用户留言模板内容
 * @author Boy Baby
 *
 */
@WebServlet("/UserModelServlet")
public class UserModelServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public UserModelServlet() {
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
		
		String title = jsonobject.getString("title");//文章标题
		String message = jsonobject.getString("messages");//留言内容
		String page = jsonobject.getString("page");//跳转页面
		String g_id = jsonobject.getString("g_id");//公众号ID
		String username = jsonobject.getString("username");//留言人


		String selectOpenid = "select fromid,token,openid from gonginfo where id = "+g_id+"";
		List list = Tools.executeQuary(selectOpenid);
		
		if(list.size()>0){
			Map map = new HashMap();
			map = (Map) list.get(0);
			String fromid = (String) map.get("fromid");
			String token = (String) map.get("token");
			String openid = (String) map.get("openid");
			JSONObject jsonModel = new JSONObject();
			JSONObject jsonMes = new JSONObject();
			
			JSONObject json1 = new JSONObject();
			JSONObject json2 = new JSONObject();
			JSONObject json3 = new JSONObject();
			
			json1.put("value",message);//留言内容
			json2.put("value",username);//留言人
			json3.put("value",title);//文章标题
			jsonMes.put("keyword1",json1);
			jsonMes.put("keyword2",json2);
			jsonMes.put("keyword3",json3);

			jsonModel.put("touser", openid);
			jsonModel.put("template_id", "XGyGSqLGyQ31OJWuE-zgzMYxB0Dqvt3HwQqgm6R02rc");
			jsonModel.put("page", page);
			jsonModel.put("form_id", fromid);//1540196916854
			jsonModel.put("data", jsonMes);
			
			System.out.println("模板数据为 : "+ jsonModel.toString());
			
			String url = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" + token;
			
			String data = HttpUtil.getJsonData(jsonModel,url);
			
			System.out.println("发送通知返回数据为 : "+ data);	
		}else{
			System.out.println("查询失败");
		}	
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
}
