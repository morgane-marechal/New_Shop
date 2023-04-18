<?php
/**
* @license MIT
* boutique-en-ligne (maxaboom)
* Copyright (c) 2023 Abraham Ukachi, Axel Vair, Morgane Marechal. The Maxaboom Project Contributors.
* All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project boutique-en-ligne
* @name Shop Page - Maxaboom
* @file shop-page.php
* @author: Abraham Ukachi <abraham.ukachi@laplateforme.io>
* @contributors: Axel Vair <axel.vair@laplateforme.io>, Morgane Marechal <morgane.marechal@laplateforme.io>
* @version: 0.0.1
* 
* Usage:
*   1-|> open http://localhost/boutique-en-ligne/index.php
* 
*
* ============================
*     >>> DESCRIPTION <<<
* ~~~~~~~~ (French) ~~~~~~~~~
* 
* -  
*
* ~~~~~~~~ (English) ~~~~~~~~~
* 
* - 
* 
* ============================
* IMPORTANT: This is a working progress and subject to major changes ;)
* ============================
*/


/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


?><!DOCTYPE html>
    
<!-- HTML -->
<html lang="en">

  <!-- HEAD -->
  <head>
    <!-- Our 4 VIP metas -->
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=no">
    <meta name="description" content="Maxaboom is a fun and dynamic online store that offers a wide variety of musical instruments. From guitars and drums to keyboards, microphones and trumpets.">
    
    <!-- Title -->
    <title>Shop @ Maxaboom | The #1 online store for all your musical needs</title>


    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- Mulish - Font -->
    <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- Material Icons - https://github.com/google/material-design-icons/tree/master/font -->
    <!-- https://material.io/resources/icons/?style=baseline -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  
     
    <!-- Base -->
    <base href="/boutique-en-ligne/">

    <!-- Logo - Icon -->
    <link rel="icon" href="assets/images/favicon.ico">

    <!-- See https://goo.gl/OOhYW5 -->
    <link rel="manifest" href="manifest.json">

    <!-- See https://goo.gl/qRE0vM -->
    <meta name="theme-color" content="#FFDCBA">

    <!-- Add to homescreen for Chrome on Android. Fallback for manifest.json -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Maxaboom">

    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Maxaboom">

    <!-- Homescreen icons -->
    <link rel="apple-touch-icon" href="assets/images/manifest/icon-48x48.png">
    <link rel="apple-touch-icon" sizes="72x72" href="assets/images/manifest/icon-72x72.png">
    <link rel="apple-touch-icon" sizes="96x96" href="assets/images/manifest/icon-96x96.png">
    <link rel="apple-touch-icon" sizes="144x144" href="assets/images/manifest/icon-144x144.png">
    <link rel="apple-touch-icon" sizes="192x192" href="assets/images/manifest/icon-192x192.png">


    <!-- Theme -->
    <link rel="stylesheet" href="assets/theme/color.css">
    <link rel="stylesheet" href="assets/theme/typography.css">

    <!-- <link rel="stylesheet" href="assets/theme/styles.css"> -->
    
    
    <!-- Animations -->
    <!-- <link rel="stylesheet" href="assets/animations/fade-in-animation.css"> -->
    <!-- <link rel="stylesheet" href="assets/animations/slide-from-down-animation.css"> -->

    <!-- Stylesheet -->
    <!-- <link rel="stylesheet" href="assets/stylesheets/home-styles.css"> -->


    <!-- Script -->
    <script>

      // Let's do some stuff when this page loads...
      window.addEventListener('load', (event) => { 
        // ...do something awesome here ;)
      });
      
    </script>
    
    <!-- Some more script for ya! #LOL -->
    <script src="src/app.js" type="module" defer></script>
    <!-- <script src="src/script/home.js" defer></script> -->

    <style>
      [active] {
        color: red;
      }
    </style>
  </head>
  <!-- End of HEAD -->
  
  
  <!-- BODY | Default Theme: light -->
  <body class="theme <?= $theme ?>" fullbleed>

    <!-- MAIN -->
    <main class="flex-layout vertical">
      <!-- App Layout - MAIN -->
      <div class="app-layout">
        <h1>Shop @ Maxaboom!</h1>
        <p>welcome to the shop page of <b>Maxaboom</b> 🛍</p>
        <a href="home">Go back to <b>home page</b></a>
      </div>
      <!-- End of App Layout - MAIN -->

      <!-- Nav Bar -->
      <!-- PHP: Include the `nav-bar` component -->
      <?php 
        $_GET['navbar_orientation'] = 'veritcal'; 
        $_GET['navbar_page'] = 'home'; 
        $_GET['navbar_connected'] = 'false'; 
      ?>

      <?php // include 'components/nav-bar.php'; ?>
      <!-- End of Nav Bar -->

      <ul style='overflow:scroll'>
        <!--  CATEGORIES LIST HERE -->

        <?php foreach ($categories as $category): ?>
        <li>
          <?php foreach ($category as $key => $value): ?>
          <p><strong><a href="shop/<?=$value ?>" <?= ($value === $this->categoryName) ? 'active': '' ?>> <?=$value ?></a></strong></p>
          <?php endforeach; ?>
        </li>
        <?php endforeach; ?>
      </ul>

      <ul style='overflow:scroll'>
        <!-- TODO : PUT SUB CATEGORIES LIST HERE -->

        <?php foreach ($subCategories as $subCategory): ?>
          <li>
            <?php foreach ($subCategory as $key => $value): ?>
              <?php $valueChange = str_replace(' ', '-', $value) ?>
              <p><strong><a href="shop/<?= $this->categoryName . '/' . $valueChange ?>"><?= $value ?></a></strong></p>
            <?php endforeach; ?>
          </li>
        <?php endforeach; ?>
      </ul>


<!-- <?php if(!isset($_GET['a:category'])): ?> -->
      <ul style='overflow:scroll'>
        <!-- LIST PRODUCT -->
        <?php foreach ($products as $product): ?>

        <li>
          <?php foreach ($product as $key => $value): ?>
            <p><?= $key ?>&nbsp; <strong><?= $value ?></strong></p>

          <?php endforeach; ?>
        </li>
        <?php endforeach; ?>
      </ul>
      <!--  <?php else :?> -->
      <!--  <?= "Hello" ?> -->
      <!--  <?php endif; ?> -->

    </main>
    <!-- End of MAIN -->

    

    <!-- ASIDE -->
    <aside class="flex-layout vertical" hidden>
      <!-- Vertical Left - DIVIDER -->
      <span class="divider vertical left"></span>

      <!-- App Layout - ASIDE -->
      <div class="app-layout" fit></div>
      <!-- End of App Layout - ASIDE -->
    </aside>
    <!-- End of ASIDE -->
    

    <!-- Backdrop -->
    <div id="backdrop" hidden></div>


    <!-- Menus  -->
    <div id="menus" hidden></div>
    <!-- End of Menus  -->

    <!-- Dialogs  -->
    <div id="dialogs" hidden></div>
    <!-- End of Dialogs  -->

    <!-- Toast -->
    <div id="toast" hidden></div>
    <!-- End of Toast -->

  </body>
  <!-- End of BODY -->

</html>
<!-- End of HTML -->
