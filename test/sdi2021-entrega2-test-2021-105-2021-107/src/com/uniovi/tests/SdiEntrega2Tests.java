package com.uniovi.tests;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
//Paquetes Java
import java.util.List;

import org.bson.Document;
//Paquetes JUnit 
import org.junit.*;
import org.junit.runners.MethodSorters;
import static org.junit.Assert.assertTrue;
//Paquetes Selenium 
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

//Paquetes Utilidades de Testing Propias
import com.uniovi.tests.util.SeleniumUtils;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;
//Paquetes con los Page Object
import com.uniovi.tests.pageobjects.*;


//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING) 
public class SdiEntrega2Tests {
	//En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens automáticas)):
	
	//Alberto:
	static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver024 = "D:\\Descargas\\PL-SDI-Sesión5-material\\PL-SDI-Sesión5-material\\geckodriver024win64.exe";
	
	
	
	//En MACOSX (Debe ser la versión 65.0.1 y desactivar las actualizacioens automáticas):
	//static String PathFirefox65 = "/Applications/Firefox 2.app/Contents/MacOS/firefox-bin";
	//static String PathFirefox64 = "/Applications/Firefox.app/Contents/MacOS/firefox-bin";
	//static String Geckdriver024 = "/Users/delacal/Documents/SDI1718/firefox/geckodriver024mac";
	//static String Geckdriver022 = "/Users/delacal/Documents/SDI1718/firefox/geckodriver023mac";
	//Común a Windows y a MACOSX
	static WebDriver driver = getDriver(PathFirefox65, Geckdriver024); 
	static String URL = "http://localhost:8081";
	static String URL_Cliente = "http://localhost:8081/cliente.html";


	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		
		
		MongoClientURI uri = new MongoClientURI(
			    "mongodb://admin:sdi@wallapop-shard-00-00.msduo.mongodb.net:27017,wallapop-shard-00-01.msduo.mongodb.net:27017,wallapop-shard-00-02.msduo.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-otiliw-shard-0&authSource=admin&retryWrites=true&w=majority");
		MongoClient mongoClient = new MongoClient(uri);
		MongoDatabase database = mongoClient.getDatabase("myFirstDatabase");
			
		database.getCollection("usuarios").deleteMany(new Document());
		database.getCollection("ofertas").deleteMany(new Document());
		
		Document admin = new Document();
		admin.append("email", "admin@email.com");
		admin.append("nombre", "admin");
		admin.append("apellidos", "wallapop");
		admin.append("password", "ebd5359e500475700c6cc3dd4af89cfd0569aa31724a1bf10ed1e3019dcfdb11");
		admin.append("dinero", 0);
		admin.append("perfil", "Admin");
		
		database.getCollection("usuarios").insertOne(admin);
		
		List<Document> usuariosSample = new ArrayList<Document>();
		
		
		Document eliminable1 = new Document();
		eliminable1.append("email", "eliminable1@eliminable1.com");
		eliminable1.append("nombre", "eliminable1");
		eliminable1.append("apellidos", "eliminable1");
		eliminable1.append("password", "57420b1f0b1e2d07e407a04ff8bbc205a57b3055b34ed94658c04ed38f62daa7");
		eliminable1.append("dinero", 100.0);
		eliminable1.append("perfil", "Estandar");
		usuariosSample.add(eliminable1);
		
		Document eliminable2 = new Document();
		eliminable2.append("email", "eliminable2@eliminable2.com");
		eliminable2.append("nombre", "eliminable2");
		eliminable2.append("apellidos", "eliminable2");
		eliminable2.append("password", "767b99cac9736794a079924ea108fc3614754c2c44d10f57c9a8d490018f0fdc");
		eliminable2.append("dinero", 100.0);
		eliminable2.append("perfil", "Estandar");
		usuariosSample.add(eliminable2);
		
		Document eliminable3 = new Document();
		eliminable3.append("email", "eliminable3@eliminable3.com");
		eliminable3.append("nombre", "eliminable3");
		eliminable3.append("apellidos", "eliminable3");
		eliminable3.append("password", "57420b1f0b1e2d07e407a04ff8bbc205a57b3055b34ed94658c04ed38f62daa7");
		eliminable3.append("dinero", 100.0);
		eliminable3.append("perfil", "Estandar");
		usuariosSample.add(eliminable3);
		
		Document eliminable4 = new Document();
		eliminable4.append("email", "eliminable4@eliminable4.com");
		eliminable4.append("nombre", "eliminable4");
		eliminable4.append("apellidos", "eliminable4");
		eliminable4.append("password", "767b99cac9736794a079924ea108fc3614754c2c44d10f57c9a8d490018f0fdc");
		eliminable4.append("dinero", 100.0);
		eliminable4.append("perfil", "Estandar");
		usuariosSample.add(eliminable4);
		
		Document prueba1 = new Document();
		prueba1.append("email", "prueba1@prueba1.com");
		prueba1.append("nombre", "prueba1");
		prueba1.append("apellidos", "prueba1");
		prueba1.append("password", "57420b1f0b1e2d07e407a04ff8bbc205a57b3055b34ed94658c04ed38f62daa7");
		prueba1.append("dinero", 100.0);
		prueba1.append("perfil", "Estandar");
		usuariosSample.add(prueba1);
		
		Document prueba2 = new Document();
		prueba2.append("email", "prueba2@prueba2.com");
		prueba2.append("nombre", "prueba2");
		prueba2.append("apellidos", "prueba2");
		prueba2.append("password", "767b99cac9736794a079924ea108fc3614754c2c44d10f57c9a8d490018f0fdc");
		prueba2.append("dinero", 100.0);
		prueba2.append("perfil", "Estandar");
		usuariosSample.add(prueba2);
		
		
		
		Document eliminable5 = new Document();
		eliminable5.append("email", "eliminable5@eliminable5.com");
		eliminable5.append("nombre", "eliminable5");
		eliminable5.append("apellidos", "eliminable5");
		eliminable5.append("password", "57420b1f0b1e2d07e407a04ff8bbc205a57b3055b34ed94658c04ed38f62daa7");
		eliminable5.append("dinero", 100.0);
		eliminable5.append("perfil", "Estandar");
		usuariosSample.add(eliminable5);
		
		
		
		database.getCollection("usuarios").insertMany(usuariosSample);
		
		
		List<Document> ofertasSample = new ArrayList<Document>();
		
		Document oferta1 = new Document();
		oferta1.append("titulo", "Mechero");
		oferta1.append("detalle", "A gas");
		oferta1.append("precio", "7.32");
		oferta1.append("fecha", "10/5/2021");
		oferta1.append("usuario", "prueba1@prueba1.com");
		oferta1.append("comprada", false);
		oferta1.append("destacada", false);
		ofertasSample.add(oferta1);
		
		Document oferta2 = new Document();
		oferta2.append("titulo", "Consola");
		oferta2.append("detalle", "Nintedo DS");
		oferta2.append("precio", "53");
		oferta2.append("fecha", "7/5/2021");
		oferta2.append("usuario", "prueba1@prueba1.com");
		oferta2.append("comprada", false);
		oferta2.append("destacada", false);
		ofertasSample.add(oferta2);
		
		Document oferta3 = new Document();
		oferta3.append("titulo", "Boli");
		oferta3.append("detalle", "Bic, color azul");
		oferta3.append("precio", "0.75");
		oferta3.append("fecha", "14/4/2021");
		oferta3.append("usuario", "prueba1@prueba1.com");
		oferta3.append("comprada", true);
		oferta3.append("destacada", false);
		oferta3.append("comprador", "prueba2@prueba2.com");
		ofertasSample.add(oferta3);
		
		Document oferta32= new Document();
		oferta32.append("titulo", "Deus Ex: MK");
		oferta32.append("detalle", "Para XBOX one");
		oferta32.append("precio", "47");
		oferta32.append("fecha", "14/4/2021");
		oferta32.append("usuario", "prueba1@prueba1.com");
		oferta32.append("comprada", false);
		oferta32.append("destacada", false);
		ofertasSample.add(oferta32);
		
		
		Document oferta4 = new Document();
		oferta4.append("titulo", "Microfono");
		oferta4.append("detalle", "H3CD");
		oferta4.append("precio", "10.75");
		oferta4.append("fecha", "14/4/2021");
		oferta4.append("usuario", "prueba1@prueba1.com");
		oferta4.append("comprada", false);
		oferta4.append("destacada", false);
		ofertasSample.add(oferta4);
		
		
		database.getCollection("ofertas").insertMany(ofertasSample);
		
		
		
		
		
		
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}


	@Before
	public void setUp(){
		driver.navigate().to(URL);
	}
	@After
	public void tearDown(){
		driver.manage().deleteAllCookies();
	}
	@BeforeClass 
	static public void begin() {
		//COnfiguramos las pruebas.
		//Fijamos el timeout en cada opción de carga de una vista. 2 segundos.
		PO_View.setTimeout(4);

	}
	@AfterClass
	static public void end() {
		//Cerramos el navegador al finalizar las pruebas
		driver.quit();
	}

	//PR01. Registro de Usuario con datos válidos /
	@Test
	public void PR01() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "selenium1@hotmail.es", "sele", "test", "pass12", "pass12");
		PO_View.checkElement(driver, "text", "selenium1@hotmail.es");	
		PO_HomeView.clickOption(driver, "deslogear", "class", "btn btn-primary"); //Cerrar sesión
	}

	//PR02. Registro de Usuario con datos inválidos (email, nombre y apellidos vacíos) /
	@Test
	public void PR02() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "", "", "", "pass12", "pass12");
		PO_View.checkElement(driver, "h2", "Registrar usuario");			
	}

	//PR03. Registro de Usuario con datos inválidos (repetición de contraseña inválida) /
	@Test
	public void PR03() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "selenium2@hotmail.es", "sele", "test", "pass21", "pass12");
		PO_View.checkElement(driver, "text", "Las contraseñas no coinciden");			
	}
	
	//PR04. Registro de Usuario con datos inválidos (email existente) /
	@Test
	public void PR04() {
		PO_HomeView.clickOption(driver, "registrarse", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "selenium1@hotmail.es", "sele", "test", "pass12", "pass12");
		PO_View.checkElement(driver, "text", "Email ya registrado");			
	}
	
	//PR05. Inicio de sesión con datos válido/
	@Test
	public void PR05() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "pass12");
		PO_View.checkElement(driver, "h2", "Mis Ofertas");	
		PO_HomeView.clickOption(driver, "deslogear", "class", "btn btn-primary");
	}
	
	//PR06. Inicio de sesión con datos inválidos (email existente, pero contraseña incorrecta) /
	@Test
	public void PR06() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "incorrecto");
		PO_View.checkElement(driver, "text", "Contraseña incorrecta");		
	}
	
	//PR07. Inicio de sesión con datos inválidos (campo email o contraseña vacíos). /
	@Test
	public void PR07() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "");		
		PO_View.checkElement(driver, "h2", "Iniciar Sesión");	
	}	
	
	//PR08. Inicio de sesión con datos inválidos (email no existente en la aplicación). /
	@Test
	public void PR08() {
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "inexistente@hotmail.es", "pass12");		
		PO_View.checkElement(driver, "text", "Email no registrado");			
	}	
	
	//PR09. Hacer click en la opción de salir de sesión y comprobar que se redirige a la página de inicio de sesión (Login). /
	@Test
	public void PR09() {
		//Primero entro en sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "pass12");
		PO_View.checkElement(driver, "h2", "Mis Ofertas");
		
		//Salgo de sesión:
		PO_HomeView.clickOption(driver, "deslogear", "class", "btn btn-primary");
		PO_View.checkElement(driver, "h2", "Iniciar Sesión");			
	}	
	//PR10. Comprobar que el botón cerrar sesión no está visible si el usuario no está autenticado /
	@Test
	public void PR10() {
		SeleniumUtils.textoNoPresentePagina(driver, "deslogear");		
		SeleniumUtils.textoNoPresentePagina(driver, "Cerrar Sesión");	
		
		//Compruebo que el resto de opciones si lo están:
		SeleniumUtils.textoPresentePagina(driver, "Registrarse");	
		SeleniumUtils.textoPresentePagina(driver, "Identifícate");	
	}	
	
	//PR11. Mostrar el listado de usuarios y comprobar que se muestran todos los que existen en el sistema /
	@Test
	public void PR11() {
		//Inicio sesión con admin:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		
		PO_View.checkElement(driver, "h2", "Usuarios del sistema");	
		PO_View.checkElement(driver, "text", "selenium1@hotmail.es");
		PO_View.checkElement(driver, "text", "prueba1@prueba1.com");
		PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
		PO_View.checkElement(driver, "text", "eliminable5@eliminable5.com");
		PO_View.checkElement(driver, "text", "eliminable4@eliminable4.com");
		PO_View.checkElement(driver, "text", "eliminable3@eliminable3.com");
		PO_View.checkElement(driver, "text", "eliminable2@eliminable2.com");
		PO_View.checkElement(driver, "text", "eliminable1@eliminable1.com");
	}	
	
	//PR12. Ir a la lista de usuarios, borrar el primer usuario de la lista, comprobar que la lista se actualiza y dicho usuario desaparece. /
	@Test
	public void PR12() {
		//Inicio sesión con admin:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");
		
		//Elimino:
		PO_UsersView.deleteUser(driver, "eliminable1@eliminable1.com");
		PO_View.checkElement(driver, "text", "Eliminado correctamente");
		
		//Desaparece:
		SeleniumUtils.textoNoPresentePagina(driver, "eliminable1@eliminable1.com");
		PO_View.checkElement(driver, "text", "selenium1@hotmail.es");
		PO_View.checkElement(driver, "text", "prueba1@prueba1.com");
		PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
		PO_View.checkElement(driver, "text", "eliminable5@eliminable5.com");
		PO_View.checkElement(driver, "text", "eliminable4@eliminable4.com");
		PO_View.checkElement(driver, "text", "eliminable3@eliminable3.com");
		PO_View.checkElement(driver, "text", "eliminable2@eliminable2.com");
	}	
	
	
	 
	
	//PR13. Ir a la lista de usuarios, borrar el último usuario de la lista, comprobar que la lista se actualiza y dicho usuario desaparece. /
	@Test
	public void PR13() {
		//Inicio sesión con admin:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");	
		
		//Elimino:
		PO_UsersView.deleteUser(driver, "eliminable5@eliminable5.com");
		PO_View.checkElement(driver, "text", "Eliminado correctamente");
				
		//Desaparece:
		SeleniumUtils.textoNoPresentePagina(driver, "eliminable5@eliminable5.com");
		PO_View.checkElement(driver, "text", "selenium1@hotmail.es");
		PO_View.checkElement(driver, "text", "prueba1@prueba1.com");
		PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
		PO_View.checkElement(driver, "text", "eliminable4@eliminable4.com");
		PO_View.checkElement(driver, "text", "eliminable3@eliminable3.com");
		PO_View.checkElement(driver, "text", "eliminable2@eliminable2.com");
	}	
	
	//PR14.Ir a la lista de usuarios, borrar 3 usuarios, comprobar que la lista se actualiza y dichos usuarios desaparecen /
	@Test
	public void PR14() {
		//Inicio sesión con admin:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "admin@email.com", "admin");	
		
		
		String[] emails = {"eliminable4@eliminable4.com","eliminable3@eliminable3.com","eliminable2@eliminable2.com"};
		
		//Elimino:
		PO_UsersView.deleteUsers(driver, emails);
		PO_View.checkElement(driver, "text", "Eliminado correctamente");
				
		//Desaparece:
		SeleniumUtils.textoNoPresentePagina(driver, "eliminable4@eliminable4.com");
		SeleniumUtils.textoNoPresentePagina(driver, "eliminable3@eliminable3.com");
		SeleniumUtils.textoNoPresentePagina(driver, "eliminable2@eliminable2.com");
		PO_View.checkElement(driver, "text", "selenium1@hotmail.es");
		PO_View.checkElement(driver, "text", "prueba1@prueba1.com");
		PO_View.checkElement(driver, "text", "prueba2@prueba2.com");
	}	
	
	
	
	//PR15. Ir al formulario de alta de oferta, rellenarla con datos válidos y pulsar el botón Submit. Comprobar que la oferta sale en el listado de ofertas de dicho usuario /
	@Test
	public void PR15() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "pass12");	
		
		
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/agregar')]");
		elementos.get(0).click();
		
		//Añado:
		PO_AddOfertaView.fillForm(driver, "Reloj", "Digital", "27.32");
		
		//Compruebo:
		PO_View.checkElement(driver, "h2", "Mis Ofertas");
		PO_View.checkElement(driver, "text", "Reloj");
		PO_View.checkElement(driver, "text", "Digital");
		PO_View.checkElement(driver, "text", "27.32");
		
	}	
	
	//PR16. Ir al formulario de alta de oferta, rellenarla con datos inválidos (campo título vacío y precio en negativo) y pulsar el botón Submit. Comprobar que se muestra el mensaje de campo obligatorio /
	@Test
	public void PR16() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "pass12");
		
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/agregar')]");
		elementos.get(0).click();
		
		//Añado:
		PO_AddOfertaView.fillForm(driver, "Camión", "De juguete", "-15.30");
		//Compruebo:
		PO_View.checkElement(driver, "text", "Agregar Oferta");
		
		//Añado:
		PO_AddOfertaView.fillForm(driver, "", "De juguete", "15.30");
		//Compruebo:
		PO_View.checkElement(driver, "text", "Agregar Oferta");
	}	
	
	
	
	
	//PR017. Mostrar el listado de ofertas para dicho usuario y comprobar que se muestran todas las que existen para este usuario.  /
	@Test
	public void PR17() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "pass12");
				
		
		//Compruebo:
		PO_View.checkElement(driver, "text", "Reloj");
		PO_View.checkElement(driver, "text", "Digital");
		PO_View.checkElement(driver, "text", "27.32");
	}	
	
	
	
	
	//PR18. Ir a la lista de ofertas, borrar la primera oferta de la lista, comprobar que la lista se actualiza y que la oferta desaparece. /
	@Test
	public void PR18() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");	
		
		
		PO_View.checkElement(driver, "text", "Mechero");
		PO_OwnOfertasView.deleteOferta(driver, "Mecheroeliminar");
		PO_View.checkElement(driver, "text", "Oferta eliminada correctamente");
		SeleniumUtils.textoNoPresentePagina(driver, "Mechero");
	}	
	
	//PR19. Ir a la lista de ofertas, borrar la última oferta de la lista, comprobar que la lista se actualizay que la oferta desaparece /
	@Test
	public void PR19() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		
		
		PO_View.checkElement(driver, "text", "Microfono");
		PO_OwnOfertasView.deleteOferta(driver, "Microfonoeliminar");
		PO_View.checkElement(driver, "text", "Oferta eliminada correctamente");
		SeleniumUtils.textoNoPresentePagina(driver, "Microfono");			
	}	
	
	
	
	
	//P20. Hacer una búsqueda con el campo vacío y comprobar que se muestra la página que corresponde con el listado de las ofertas existentes en el sistema /
	@Test
	public void PR20() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
				
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();				
		
		PO_View.checkElement(driver, "text", "Consola");
		PO_View.checkElement(driver, "text", "Reloj");
	}	
	
	//PR21. Hacer una búsqueda escribiendo en el campo un texto que no exista y comprobar que se muestra la página que corresponde, con la lista de ofertas vacía. /
	@Test
	public void PR21() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
						
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();
		
		
		PO_View.checkElement(driver, "text", "Consola");
		PO_View.checkElement(driver, "text", "Reloj");
		
		PO_SearchOferta.searchOferta(driver,"Gambas fritas");
		
		SeleniumUtils.textoNoPresentePagina(driver, "Consola");
		SeleniumUtils.textoNoPresentePagina(driver, "Reloj");
		
		
		
		
	}	
	
	//PR22. Hacer una búsqueda escribiendo en el campo un texto en minúscula o mayúscula y comprobar que se muestra la página que corresponde, 
	//con la lista de ofertas que contengan dicho texto, independientemente que el título esté almacenado en minúsculas o mayúscula /
	@Test
	public void PR22() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
								
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();
				
				
		PO_View.checkElement(driver, "text", "Consola");
		PO_View.checkElement(driver, "text", "Reloj");
				
		PO_SearchOferta.searchOferta(driver,"CONSOLA");
		PO_View.checkElement(driver, "text", "Consola");
		SeleniumUtils.textoNoPresentePagina(driver, "Reloj");	
		
		PO_SearchOferta.searchOferta(driver,"consola");
		PO_View.checkElement(driver, "text", "Consola");
		SeleniumUtils.textoNoPresentePagina(driver, "Reloj");	
	}	
	
	
	
	//PR23. Sobre una búsqueda determinada (a elección de desarrollador), comprar una oferta que 
	//deja un saldo positivo en el contador del comprobador. Y comprobar que el contador se 
	//actualiza correctamente en la vista del comprador /
	@Test
	public void PR23() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "prueba2");
		
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();
		PO_SearchOferta.searchOferta(driver,"Consola");
		
		PO_View.checkElement(driver, "text", "prueba2@prueba2.com");	
		PO_View.checkElement(driver, "li", "100€");
		PO_SearchOferta.buyOferta(driver, "Consola");
		PO_View.checkElement(driver, "text", "Compra realizada con éxito");
		PO_View.checkElement(driver, "li", "47.00€");
		
		
		
	}	
	
	//PR24. Sobre una búsqueda determinada (a elección de desarrollador), comprar una oferta que 
	//deja un saldo 0 en el contador del comprobador. Y comprobar que el contador se actualiza 
	//correctamente en la vista del comprador.  /
	@Test
	public void PR24() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "prueba2");
				
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();
		PO_SearchOferta.searchOferta(driver,"Deus");
				
		PO_View.checkElement(driver, "text", "prueba2@prueba2.com");	
		PO_View.checkElement(driver, "li", "47.00€");
		PO_SearchOferta.buyOferta(driver, "Deus Ex: MK");
		PO_View.checkElement(driver, "text", "Compra realizada con éxito");
		PO_View.checkElement(driver, "li", "0.00€");			
	}	
	
	
	//PR25. Sobre una búsqueda determinada (a elección de desarrollador), intentar comprar una 
	//oferta que esté por encima de saldo disponible del comprador. Y comprobar que se muestra el 
	//mensaje de saldo no suficiente /
	@Test
	public void PR25() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "prueba2");
						
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();
		PO_SearchOferta.searchOferta(driver,"Reloj");
						
		PO_View.checkElement(driver, "text", "prueba2@prueba2.com");	
		PO_View.checkElement(driver, "li", "0.00€");
		PO_SearchOferta.buyOferta(driver, "Reloj");
		PO_View.checkElement(driver, "text", "No tiene dinero suficiente para realizar la compra");
		PO_View.checkElement(driver, "li", "0.00€");			
	}	
	
	
	
	
	//PR26. ] Ir a la opción de ofertas compradas del usuario y mostrar la lista. Comprobar que 
	//aparecen las ofertas que deben aparecer. /
	@Test
	public void PR26() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "prueba2");
								
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'compras')]");
		elementos.get(0).click();	
		
		
		PO_View.checkElement(driver, "text", "Consola");
		PO_View.checkElement(driver, "text", "Boli");
		PO_View.checkElement(driver, "text", "Deus Ex: MK");
		SeleniumUtils.textoNoPresentePagina(driver, "Reloj");
		
	}	
	
	
	//PR26. Al crear una oferta marcar dicha oferta como destacada y a continuación comprobar: i) 
	//que aparece en el listado de ofertas destacadas para los usuarios y que el saldo del usuario se 
	//actualiza adecuadamente en la vista del ofertante (-20). /
	@Test
	public void PR27() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/agregar')]");
		elementos.get(0).click();	
		
		
		PO_View.checkElement(driver, "li", "100€");
		PO_AddOfertaView.fillForm(driver, "Somier", "Azul y bonito", "532", true);
		
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();
		

		
		PO_View.checkElement(driver, "h2", "Ofertas Destacadas");
		PO_View.checkElement(driver, "text", "Somier");
		PO_View.checkElement(driver, "li", "80");
	}


	
	//PR26. Sobre el listado de ofertas de un usuario con más de 20 euros de saldo, pinchar en el 
	//enlace Destacada y a continuación comprobar: i) que aparece en el listado de ofertas destacadas 
	//para los usuarios y que el saldo del usuario se actualiza adecuadamente en la vista del ofertante (-
	//20). /
	@Test
	public void PR28() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba1@prueba1.com", "prueba1");
		
		
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/agregar')]");
		elementos.get(0).click();	
		
		
		
		PO_AddOfertaView.fillForm(driver, "Hoja", "DINA4", "0.05", false);
		
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/propias')]");
		elementos.get(0).click();
		
		PO_View.checkElement(driver, "li", "80.00€");
		PO_OwnOfertasView.destacarOferta(driver,"Hojadestacar");
		
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/buscar')]");
		elementos.get(0).click();
		
		PO_SearchOferta.searchOferta(driver, "Hoja");
		
		PO_View.checkElement(driver, "li", "60.00€");
		PO_View.checkElement(driver, "h2", "Ofertas Destacadas");
		PO_View.checkElement(driver, "text", "Hoja");
	}	
	
	
	//PR26. Sobre el listado de ofertas de un usuario con menos de 20 euros de saldo, pinchar en el 
	//enlace Destacada y a continuación comprobar que se muestra el mensaje de saldo no suficiente /
	@Test
	public void PR29() {
		//Inicio sesión:
		PO_HomeView.clickOption(driver, "identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "prueba2");
				
				
		List<WebElement> elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/agregar')]");
		elementos.get(0).click();	
				
		PO_AddOfertaView.fillForm(driver, "Botella", "De vidrio", "10.05", false);
				
		elementos = PO_View.checkElement(driver, "free", "//li[contains(@id,'mOferta')]/a");
		elementos.get(0).click();
		elementos = PO_View.checkElement(driver, "free", "//a[contains(@href, 'ofertas/propias')]");
		elementos.get(0).click();
				
		PO_View.checkElement(driver, "li", "0.00€");
		PO_OwnOfertasView.destacarOferta(driver,"Botelladestacar");
		
		PO_View.checkElement(driver, "li", "0.00€");
		PO_View.checkElement(driver, "text", "No dispones de dinero suficiente para destacar tu oferta");
	}
	
	
	
	
	
	
	
	//PR30. Inicio de sesión con datos válidos./
	@Test
	public void PR30() {
		driver.navigate().to(URL_Cliente);	
		
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "prueba2");
		PO_View.checkElement(driver, "text", "Reloj");
		
		
		
	}	
	
	//PR31. Inicio de sesión con datos inválidos (email existente, pero contraseña incorrecta). /
	@Test
	public void PR31() {
		driver.navigate().to(URL_Cliente);	
		
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "incorrecto");
		PO_View.checkElement(driver, "text", "Usuario no encontrado");		
	}

	//PR32. Inicio de sesión con datos válidos (campo email o contraseña vacíos). /
	@Test
	public void PR32() {
		driver.navigate().to(URL_Cliente);	
		
		PO_LoginView.fillForm(driver, "prueba2@prueba2.com", "");
		PO_View.checkElement(driver, "text", "Usuario no encontrado");				
	}
	
	
	
	//PR33. Mostrar el listado de ofertas disponibles y comprobar que se muestran todas las que 
	//existen, menos las del usuario identificado. /
	@Test
	public void PR33() {
		driver.navigate().to(URL_Cliente);	
		
		PO_LoginView.fillForm(driver, "selenium1@hotmail.es", "pass12");
		
		PO_View.checkElement(driver, "text", "Consola");
		PO_View.checkElement(driver, "text", "Boli");
		PO_View.checkElement(driver, "text", "Deus Ex: MK");
		SeleniumUtils.textoNoPresentePagina(driver, "Reloj");
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*
	 * //PR34.] Sobre una búsqueda determinada de ofertas (a elección de desarrollador), enviar un 
	//mensaje a una oferta concreta. Se abriría dicha conversación por primera vez. Comprobar que el 
	//mensaje aparece en el listado de mensajes /
	@Test
	public void PR34() {
		assertTrue("PR34 sin hacer", false);			
	}
	
	//PR35. Sobre el listado de conversaciones enviar un mensaje a una conversación ya abierta. 
	//Comprobar que el mensaje aparece en el listado de mensajes. /
	@Test
	public void PR35() {
		assertTrue("PR35 sin hacer", false);			
	}
	 */
	
	
	
		
}

