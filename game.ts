
 /*
     file: scale.ts/js
     Author: Petri Lamminaho
     Simple Html5-game
     Made winter of 2017
 */
   //Global variables  
//-----------------------------------------------------------------------------------
            let innerW:number = window.innerWidth;
            let innerH:number = window.innerHeight;
            let gameRatio:number = innerW/innerH;
            let leveys:number = Math.ceil(800*gameRatio);
            let korkeus:number = 800;  
            let infoText;
            let  kierroksenKuulat : number;
            let   sallittuErotus:number;
            let taso : number;
            let pallojaKaytossa : number;
            let erotus : number;
            const MAX_KIERROKSET = 4;
            const MAX_TASOT = 8;
            let game = new  Phaser.Game(800, 1300, Phaser.AUTO,'content', {
            create: this.create, preload: this.preload});
            const KUULAN_MAX_KOKO = 60;
            const KUULAN_KASVU_NOPEUS = 1.5;
            const VAAKAN_KITKA = 400;
            const VAAKANY = 600;
            var kuppi;
//-----------------------------------------------------------------------------------
    // Game Boot state class
  //--------------------------------------------------------------------------------
    class BootState extends Phaser.State{
      constructor(){
      super();
}
//---------------------------------------------------------------------
    //phaser crreate-function 
    create(){
        game.state.start('preload');
            }
}
//End Of class 
//-----------------------------------------------------------
//preload-state 
//-----------------------------------------------------------
    class PreloadState extends Phaser.State{
    
    preload(){
        game.load.image('vaaka', 'kuvat/vaaka.png');
        game.load.image('kuula', 'kuvat/kuula.png');
        game.load.image('tausta1','kuvat/sky1.png');
        game.load.image('labelMessage','kuvat/message_label.png');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}
//--------------------------------------------------------------------------------------------------
    create(){
        //scale game to screen
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL ;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.updateLayout();
        game.state.start('title');
        }            }
//---------------------------------------------------------------------------------------
//Mainmenu/title-screen state 
//----------------------------------------------------------------------------------
    class TitleState extends Phaser.State{
      WebFontConfig = {
      active: function() { game.time.events.add(Phaser.Timer.SECOND, this.createText, this); },
      google: {
      families: ['Revalia']}
};
//-------------------------------------------------------------------------
    create(){
     game.stage.backgroundColor = "C3C3C3";
     taso = 1;
     this.createText();
     game.input.onTap.addOnce(this.aloita);
    }
//------------------------------------------------------------------------
   createText(){
      var text= null;
      var style = { };
      text = game.add.text(game.world.centerX, 100,"SCALE" ,style);
      text.anchor.setTo(0.5);
      text.font = 'Revalia';
      text.fontSize = 80;
      var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
      grd.addColorStop(0, '#8ED6FF');
      grd.addColorStop(1, '#004CB3');
      text.fill = grd;
      text.align = 'center';
      text.stroke = '#000000';
      text.strokeThickness = 2;
      text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
}
//----------------------------------------------------------------
//start level
 //--------------------------------------------------------------
     aloita()
     {
       game.state.start('preLevel');

     }
}
//---------------------------------------------------------------
// State load the new level
//----------------------------------------------------------------
  class PreLevelState extends Phaser.State{

//sets up Webfonts
    WebFontConfig = {
    active: function() { game.time.events.add(Phaser.Timer.SECOND, this.createText, this); },
    google: {
    families: ['Revalia']
    }
};
//-------------------------------------------------------------------------------
    create(){
      asetaTasonTiedot();
      this.createText();
      game.input.onTap.addOnce(this.aloitaPeli);
    }
 //-----------------------------------------------------------------------------
    createText(){
      var text= null;
      var style = { };
      text = game.add.text(game.world.centerX, game.world.centerY,"Level "+taso+"\n" +"Available balls " + kierroksenKuulat
      + "\n Max distance "+ sallittuErotus ,style);
      text.anchor.setTo(0.5);
      text.font = 'Revalia';
      text.fontSize = 80;
      var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
      grd.addColorStop(0, '#8ED6FF');
      grd.addColorStop(1, '#004CB3');
      text.fill = grd;
      text.align = 'center';
      text.stroke = '#000000';
      text.strokeThickness = 2;
      text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
}
//-----------------------------------------------------------------------------------
//launch gameOn state
//-------------------------------------------------------------------------------------
    aloitaPeli(){
      game.state.start("gameOn");
      }
 }
//----------------------------------------------------------------------------------------
//GameOnState class
//manage  game
//----------------------------------------------------------------------------------------
    class GameOnState extends Phaser.State{
        //class fields
       pelaajanVuoro:boolean;
        tausta:any;
        kuula : Phaser.Sprite;
        vaaka : Array<any>=[];
        groupKuuluat : Phaser.Group;
        kuulaKasvaa : boolean;
        koneenVuoro : boolean;
        painonMuutos: number;
        kierros : number;
        vaakaTasapainossa: boolean;
        varaKuullat: number;
        kaikkiPallotKaytetty : boolean;
        palloja:number;
        labelKierroksenKuulat: Phaser.Text;
         labelSallittuErotus : Phaser.Text;
         labelTaso: Phaser.Text;
         labelKierros: Phaser.Text;
         koko:number;
//------------------------------------------------------------------------------------
// create  method
//-----------------------------------------------------------------------------------  
    create(){
       this.kaikkiPallotKaytetty = false;
        this.kuulaKasvaa = false;
        this.kierros = 1; 
        this.luoUusiKierros();
    }
//------------------------------------------------------------------------------------
//change level 
//-----------------------------------------------------------------------------------------
    vaihdaTaso(){
      this.kierros = 1;
      taso++;
      game.state.start('preLevel');
    }
//---------------------------------------------------------------------------------------
//greates new level
//---------------------------------------------------------------------------------------
    luoUusiKierros(){
       if(this.kierros>MAX_KIERROKSET){
         this.vaihdaTaso();
        }
     asetaTasonTiedot();
     game.world.removeAll();
     game.add.tileSprite(0, 0, game.width, game.height,'tausta1');
     this.luoVaaka();
     this.aloitaKierros();
  }
//--------------------------------------------------------------------------------- 
    aloitaKierros(){
      this.vaakaTasapainossa = false;
      this.labelKierroksenKuulat = game.add.text(100, game.height-100, "Balls: "+ kierroksenKuulat, { font: "50px Arial", fill: "#ffffff" });
      this.labelSallittuErotus = game.add.text(100,game.height-50, "Max difference:" + sallittuErotus, { font: "50px Arial", fill: "#ffffff"});
      this.labelTaso = game.add.text(300, 20, "LEVEL:"+ taso+"/"+MAX_TASOT,  { font: "50px Arial", fill: "#ffffff"});
      this.labelKierros = game.add.text(10,20,"ROUND:"+ this.kierros+"/"+MAX_KIERROKSET,  { font: "50px Arial", fill: "#ffffff"});
      this.pelaajanVuoro = false;
      this.koneLuoKuulat();
   }
//------------------------------------------------------------------------------------
//calculates scale + balls  mass
//--------------------------------------------
   laskePaino(){

    if(this.onkoVaakaTasapainossa()==true){
        var label = game.add.sprite(0,200,'labelMessage');
        label.alpha = 0.7;
        label.tint = 0x41A500;
        kirjoitaViesti(2);
        this.kierros++;
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.luoUusiKierros, this);
    }
    if(kierroksenKuulat==0 &&  this.onkoVaakaTasapainossa()==false &&  this.onkoSallituissaRajoissa()==true){
        var label = game.add.sprite(0,200,'labelMessage');
        label.alpha = 0.7;
        label.tint = 0x41A500;
        kirjoitaViesti(3);
        this.kierros++;
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.luoUusiKierros, this);
        }

    if(kierroksenKuulat==0 &&this.onkoSallituissaRajoissa()==false) {
        var label = game.add.sprite(0,200,'labelMessage');
        label.alpha = 0.7;
        label.tint = 0xCC1831;
        kirjoitaViesti(4);
        this.game.time.events.add(Phaser.Timer.SECOND * 3, this.lopeta, this);
        }
    if(this.painonMuutos>270) 
        this.lopeta();
    else{
      this.uusiKuulaVoiPudota();
        }
}

//----------------------------------------------------------------------------------------
//Start the gameover state -> end game 
   lopeta(){
     game.state.start("gameOver");
   }
   //----------------------------------------------------------------------------
  //checks is the scale balance 
  //------------------------------------------------------------------------------
    onkoVaakaTasapainossa(): boolean{
       if(this.painonMuutos==0){
         this.vaakaTasapainossa = true;
         return true;
       }
       return false;
   }
//------------------------------------------------------------------------------------
//checks if scale diffrence is pass
//-------------------------------------------------------------------------------------

    onkoSallituissaRajoissa():boolean{
     if(this.painonMuutos <= sallittuErotus){ 
      return true;
    }
     else{ 
      return false;
     }
}
//------------------------------------------------------------------------------------------
//update ball size when player holds button down
//------------------------------------------------------------------------------------------
    update(){
     if(this.kuulaKasvaa==true&&this.kuula.width<KUULAN_MAX_KOKO){
         this.kasvataKuulaa();
     }
}
//------------------------------------------------------------------------------------------
//create the scale 
//-------------------------------------------------------------------------------------------
    luoVaaka(){
        this.vaaka[0] = game.add.group();
        this.vaaka[1]= game.add.group();
        this.vaaka[0].paino = 0;
        this.vaaka[1].paino = 0;
        let vaakaKuva = game.add.sprite(0, VAAKANY, 'vaaka');
        this.vaaka[0].add(vaakaKuva);
        vaakaKuva = game.add.sprite(410,VAAKANY,"vaaka");
        this.vaaka[1].add(vaakaKuva);
 }
//------------------------------------------------------------------------------------------------
//Moves the scale 
//---------------------------------------------------------------------------------------------
    liikutaVaakaa(){
      this.painonMuutos = (this.vaaka[0].paino-this.vaaka[1].paino)/VAAKAN_KITKA;
      console.log("vaaka 0 "+ this.vaaka[0].paino);
      console.log("vaaka 1 "+ this.vaaka[1].paino );
     //create and handles scale's move tween
      var balanceTween = game.add.tween(this.vaaka[0]).to({ 
		  y: this.painonMuutos 
          }, 
            2000, Phaser.Easing.Quadratic.Out, true);
			var balanceTween2 = game.add.tween(this.vaaka[1]).to({ 
			y: -this.painonMuutos
			}, 2000, Phaser.Easing.Quadratic.Out, true);
			balanceTween.onComplete.add(this.laskePaino,this);
            this.painonMuutos = Math.abs(this.painonMuutos);
            this.painonMuutos = this.painonMuutos/2;
            this.painonMuutos = Math.round(this.painonMuutos);
            console.log("muutos: "+ this.painonMuutos);
            erotus = this.painonMuutos;
            console.log(erotus);
}
//----------------------------------------------------------------------------------
//creates the new ball
//-----------------------------------------------------------------------------------
    kuulanLuonti(xPaikka: number, yPaikka: number, w : number, h : number){
      this.kuula = game.add.sprite(xPaikka, 400,"kuula"); 
      if(this.kuula.x<400) 
        {kuppi = 0;
       }
        else{
            kuppi = 1;
        }
           this.asetaKuulanArvot(w,h);
              this.vaaka[ kuppi].add(this.kuula)
}
//----------------------------------------------------------------------------------
//Sets ball variables (width, height and anchors)
//--------------------------------------------------------------------------------
    asetaKuulanArvot(w:number, h:number){
        this.kuula.anchor.x = 0.5;
        this.kuula.anchor.y = 0.5;
        this.kuula.width = w;
        this.kuula.height = h;
}
//--------------------------------------------------------------------------------
//Machine creates balls
//--------------------------------------------------------------------------------
    koneLuoKuulat(){
      var paikka = 500;
        for(var i= 0; i<this.kierros; i++){
         var koko = Math.random() * ((KUULAN_MAX_KOKO-30)+1)+30;
         var jakaja = i;
          if(jakaja==0)jakaja = 1;
          else{
              jakaja+=1;
            }
      koko= koko/jakaja;
      console.log("koko: "+ koko);
      this.kuulanLuonti(paikka, 100 ,koko,koko);
      this.vaaka[ kuppi].add(this.kuula);
      this.tiputaKuula();
      paikka += koko + 25;
  }
}
//-------------------------------------------------------------------------------------
//Player creates ball
//--------------------------------------------------------------------------------------
    pelaajaLuoKuulan(){

        if(kierroksenKuulat < 1) return;
        if(this.vaakaTasapainossa == true) 
        {
          return;
        }
         this.pelaajanVuoro = true;
        this.kuulanLuonti(game.input.worldX, game.input.worldY, 1,1);
        this.vaaka[ kuppi].add(this.kuula);
        game.input.onDown.remove(this.pelaajaLuoKuulan, this);
		game.input.onUp.add(this.tiputaKuula, this);
        this.kuulaKasvaa = true;
  }
//------------------------------------------------------------------------------------
//Grows the ball size
//---------------------------------------------------------------------------------------
    kasvataKuulaa(){
       // console.log("kasva");
          this.kuula.width += KUULAN_KASVU_NOPEUS;
          this.kuula.height += KUULAN_KASVU_NOPEUS;
        }
 //-------------------------------------------------------------------------------------
 //Drops the ball
 //--------------------------------------------------------------------------------------  
    tiputaKuula(){
        this.kuulaKasvaa = false;
        game.input.onUp.remove(this.tiputaKuula,this);
          if(this.pelaajanVuoro == true){
             kierroksenKuulat--;
             }
        this.labelKierroksenKuulat.text = "Balls: "+kierroksenKuulat;
        var kuulanLiike = VAAKANY - this.kuula.height/2; 
        this.vaaka[kuppi].paino+=(4/3)*Math.PI*(this.kuula.width/2)*(this.kuula.width/2)*(this.kuula.width/2);
        var ballTween = game.add.tween(this.kuula).to({ 
						y: kuulanLiike }, 2000, Phaser.Easing.Bounce.Out, true);
		ballTween.onComplete.add(this.liikutaVaakaa,this);
            }
    uusiKuulaVoiPudota(){
     game.input.onDown.add(this.pelaajaLuoKuulan,this);
    }
} //end of GameOn class
//------------------------------------------------------------------------------------
// GameOverState class
//-----------------------------------------------------------------------------------
    class GameOverState extends Phaser.State{
      WebFontConfig = {
      active: function() { game.time.events.add(Phaser.Timer.SECOND, this.createText, this); },
      google: {
        families: ['Revalia']}};
//----------------------------------------------------------------------------------------------
    create(){
      game.stage.backgroundColor = "C3C3C3";
      this.createText();
     }
//---------------------------------------------------------------------------------
//restart the game
//----------------------------------------------------------------------------------
  reStart(){

     taso=1;
       game.state.start("title");
  }
//---------------------------------------------------------------------
//Continue the game from current level 
   continueGame(){
      game.state.start("preLevel");
 }
 //--------------------------------------------------------------------------
 //create game over screen text 
 //---------------------------------------------------------------------------
    createText(){
      var text= null; 
      var style = { }; 
      text = game.add.text(game.world.centerX, 100,"Game Over" ,style);
      var  textContinue = game.add.text(game.world.centerX-300, 500,"Continue" ,style);
      var texttextBackToMainMenu = game.add.text(game.world.centerX-300, 700,"Back to the main" ,style);
      text.anchor.setTo(0.5);
      text.font = 'Revalia';
      text.fontSize = 80;
      var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
      grd.addColorStop(0, '#8ED6FF');   
      grd.addColorStop(1, '#004CB3');
      text.fill = grd;
      text.align = 'center';
      text.stroke = '#000000';
      text.strokeThickness = 2;
      text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
      textContinue.inputEnabled = true;
      textContinue.events.onInputDown.add(this.continueGame, this);
      texttextBackToMainMenu.inputEnabled = true;
      texttextBackToMainMenu.events.onInputDown.add(this.reStart, this);
 }
}
 //end of GameOverState class

 //create and add all states into StateManager 
    game.state.add('bootState', BootState,true)
    game.state.add('preload', PreloadState);
    game.state.add('title', TitleState);
    game.state.add('preLevel', PreLevelState);
    game.state.add('gameOn', GameOnState);
    game.state.add('gameOver',GameOverState);
//-------------------------------------------------------------------------------
// Creates and shows messagebox on screen 
//------------------------------------------------------------------------------
    function kirjoitaViesti(i){
      var style;
      var text

    switch(i){
      case 1:
       text = "Ballance the scale with " + kierroksenKuulat+" balls"+ 
                 "\n Maximum difference is "+this.sallittuErotus;
      break;

      case 2:
        text = "Perfect! Difference is 0\n "+
               "Difference:"+ erotus+
              " Max difference was:"+sallittuErotus;
               style = { font: "35px Arial", fill: "#19070B", align: "center" }; 

         break;
         
      case 3:
        text = "You passed!\n"+ 
                "Difference:"+ erotus+
               " Max difference was:"+sallittuErotus
                 style = { font: "35px Arial", fill: "#19070B", align: "center" };
          break;

         case 4:
            text = "GAME OVER\n"+
            "Scale separation is too great\n" +
           "Difference:"+ erotus+
           "\nMax difference was:"+sallittuErotus
             style = { font: "35px Arial", fill: "#19070B", align: "center" };
          break;
    }
 game.add.text(100, 200, text,style);
}
//-------------------------------------------------------------------------------------
//Sets level info 
//-------------------------------------------------------------------------------------
    function asetaTasonTiedot(){
      switch(taso){
              case 1:
                kierroksenKuulat = 3;
                sallittuErotus = 5;
                break;

            case 2:
                kierroksenKuulat = 3;
                sallittuErotus = 3;
                break;

            case 3:
                kierroksenKuulat = 3;
                sallittuErotus = 1;
                break;

            case 4:
                kierroksenKuulat = 2;
                sallittuErotus = 5;
                break;

            case 5:   
                kierroksenKuulat = 2;
                sallittuErotus = 3;
                break;

            case 6:
                kierroksenKuulat = 2;
                sallittuErotus = 1;
                break;

            case 7:
                kierroksenKuulat = 3;
                sallittuErotus = 0;
                break; 

            case 8:
                kierroksenKuulat = 2;
                sallittuErotus = 0;

            default:
            this.peliSuoritettu();
        }

}





//end of file 
//--------------------------------------------------------------------------------------------



