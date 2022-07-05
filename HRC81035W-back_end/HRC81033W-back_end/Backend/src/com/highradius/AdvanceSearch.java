package com.highradius;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet implementation class SearchSalesOrder
 */
@WebServlet("/AdvanceSearchRecord")
public class AdvanceSearch extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AdvanceSearch() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		PrintWriter out = response.getWriter();
		String salesOrder = null;
		
		try {
			Connection conn = GetConnection.connectToDB();
			
			BufferedReader reader = request.getReader();
			salesOrder = reader.readLine();
			System.out.println(salesOrder);
			
			salesOrder = salesOrder.substring(9,  salesOrder.length() - 2);
			String final_values[] = salesOrder.split(",");
			
			for(int i = 0; i < final_values.length; ++i) {
				final_values[i] = final_values[i].split(":")[1];
				if(final_values[i].charAt(0) == '\"') {
					final_values[i] = final_values[i].substring(1, final_values[i].length() - 1);
				}
				System.out.println(final_values[i]);
			}
			String doc_id=final_values[0];
			String invoice_id = final_values[1];
			String cust_number = final_values[2];
			String business_year = final_values[2];
			Statement st = conn.createStatement();
			String query = "SELECT * FROM winter_internship WHERE doc_id= " + doc_id + " or invoice_id= "+invoice_id+" or buisness_year= "+business_year+" or cust_number= "+cust_number+" LIMIT 11";
			ResultSet rs = st.executeQuery(query);

			
			ArrayList<InvoiceDetails> data = new ArrayList<>();
			while(rs.next()) {
				InvoiceDetails inv = new InvoiceDetails();
			    inv.setSl_no(	rs.getInt("sl_no"));
				inv.setBusiness_code(rs.getString("business_code"));
				System.out.println("business_code");
				inv.setCust_number(rs.getString("cust_number"));
				inv.setClear_date(rs.getString("clear_date"));
				inv.setBuisness_year(rs.getString("buisness_year"));
				inv.setDoc_id(rs.getString("doc_id"));
				inv.setPosting_date(rs.getString("posting_date"));
				inv.setDocument_create_date(rs.getString("document_create_date"));
				inv.setDue_in_date(rs.getString("due_in_date"));
				inv.setInvoice_currency(rs.getString("invoice_currency"));
				inv.setDocument_type(rs.getString("document_type"));
				inv.setPosting_id(rs.getString("posting_id"));
				inv.setTotal_open_amount(rs.getFloat("total_open_amount"));
				inv.setBaseline_create_date(rs.getString("baseline_create_date"));
				inv.setCust_payment_terms(rs.getString("cust_payment_terms"));
				inv.setInvoice_id(rs.getString("invoice_id"));
				data.add(inv);
			}
			
			Gson gson = new GsonBuilder().serializeNulls().create();
			String invoices = gson.toJson(data);
			System.out.print(invoices);
		
			out.print(invoices);
			response.setStatus(200);
			out.flush();
		}
		catch(ClassNotFoundException e) {
			e.printStackTrace();
		}
		catch(SQLException e) {
			e.printStackTrace();
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
