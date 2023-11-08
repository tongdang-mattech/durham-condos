<?php

$error = null;
try {
    require_once('config.php');

    $path = $_GET['path'];

    $statement = $pdo->prepare('
        SELECT  *
        FROM    `pages`
        WHERE   `path` = :path');
    if (!$statement->execute([':path' => $path])) {
        throw new Exception($statement->errorInfo()[2]);
    }

    $page = $statement->fetch(PDO::FETCH_ASSOC);
    if (!$page) {
        http_response_code(404);
        exit();
    }

    $icbm = '';
    if ($page['meta_position']) {
        $icbm = explode(';', $page['meta_position']);
        $icbm = implode(', ', $icbm);
    }

    $street = '';
    $municipality = '';
    $addressParts = explode(',', $page['title_address']);
    if (count($addressParts)) {
        $municipality = urlencode(trim(array_pop($addressParts)));
        if (!count($addressParts)) {
            $street = $municipality;
            $municipality = '';
        } else {
            $street = urlencode(trim(implode(', ', $addressParts)));
        }
    }

    $type = (false === strpos($page['path'], 'townhomes'))
        ? 'condo+apt'
        : 'condo+townhouse';

    $statement = $pdo->prepare('
        SELECT  *
        FROM    `pages_plan`
        WHERE   `page_id` = :pageId');
    if (!$statement->execute([':pageId' => $page['id']])) {
        throw new Exception($statement->errorInfo()[2]);
    }

    $plans = $statement->fetchAll(PDO::FETCH_ASSOC);

    $statement = $pdo->prepare('
        SELECT  *
        FROM    `pages_recent`
        WHERE   `page_id` = :pageId');
    if (!$statement->execute([':pageId' => $page['id']])) {
        throw new Exception($statement->errorInfo()[2]);
    }

    $recent = $statement->fetchAll(PDO::FETCH_ASSOC);

    $statement = $pdo->prepare('
        SELECT  *
        FROM    `pages_history`
        WHERE   `page_id` = :pageId
        ORDER   BY `year`');
    if (!$statement->execute([':pageId' => $page['id']])) {
        throw new Exception($statement->errorInfo()[2]);
    }

    $history = $statement->fetchAll(PDO::FETCH_ASSOC);
    $historyMinYear = 1048576;
    $historyMaxYear = 0;
    $historyYears = [];
    foreach ($history as $historyRow) {
        $historyYears[] = $historyRow['year'];
        if ($historyMinYear > $historyRow['year']) {
            $historyMinYear = $historyRow['year'];
        }
        if ($historyMaxYear < $historyRow['year']) {
            $historyMaxYear = $historyRow['year'];
        }
    }

    $statement = $pdo->prepare('
        SELECT  *
        FROM    `pages_image`
        WHERE   `page_id` = :pageId
        ORDER   BY `order` DESC');
    if (!$statement->execute([':pageId' => $page['id']])) {
        throw new Exception($statement->errorInfo()[2]);
    }

    $images = $statement->fetchAll(PDO::FETCH_ASSOC);
    $firstImage = array_shift($images);
} catch (Exception $e) {
    echo $e->getMessage();
    exit();
}

?>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title><?php echo htmlspecialchars($page['title_full']) ?></title>
    <base href="../../"/>
    <meta name="geo.region" content="<?php echo htmlspecialchars($page['meta_region']) ?>"/>
    <meta name="geo.placename" content="<?php echo htmlspecialchars($page['meta_placename']) ?>"/>
    <meta name="geo.position" content="<?php echo htmlspecialchars($page['meta_position']) ?>"/>
    <meta name="ICBM" content="<?php echo htmlspecialchars($icbm) ?>"/>
    <meta name="description" content="<?php echo htmlspecialchars($page['meta_description']) ?>"/>
    <meta name="keywords" content="<?php echo htmlspecialchars($page['meta_keywords']) ?>"/>
    <link rel="author" href="<?php echo htmlspecialchars($page['meta_author']) ?>"/>
    <meta http-equiv="Bulletin-Text" content="<?php echo htmlspecialchars($page['meta_bulletin_text']) ?>"/>
    <meta name="robots" content="all,index,follow"/>
    <meta name="revisit-after" content="4 days"/>
    <meta name="copyright" content="Copyright © 2011 durhamcondos.ca, all rights reserved."/>
    <meta name="location" content="<?php echo htmlspecialchars($page['meta_location']) ?>"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"
            integrity="sha512-3n19xznO0ubPpSwYCRRBgHh63DrV+bdZfHK52b1esvId4GsfwStQNPJFjeQos2h3JwCmZl0/LgLxSKMAI55hgw=="
            crossorigin="anonymous"></script>
    <link rel="stylesheet" href="wp/wp-content/plugins/blueimp-gallery/css/blueimp-gallery.min.css"/>
    <link rel="stylesheet" href="lib/jQuery-Plugin-For-Floating-Social-Share-Contact-Sidebar/css/contact-buttons.css"/>

    <link rel="stylesheet" type="text/css" href="css/bootstrap.css"/>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
    <link rel="stylesheet" type="text/css" href="css/style.css"/>
    <link rel="stylesheet" href="css/style3.css">

    <link href='https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700' rel='stylesheet' type='text/css'/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"/>

    <style type="text/css">
        .band-top .x-section {
            height: 100vh;
        }

        .broker-logo img {
            height: 100px;
            margin: 20px 0 0 50px;

        }

        .broker-logo {
            z-index: 9990 !important;
        }

        .x-container {
            margin: 0 auto;
        }

        .center-text {
            text-align: center;
        }

        .x-gap {
            border-color: transparent;
        }

        .h-custom-headline {
            letter-spacing: -1px;
            line-height: 1.1;
        }

        .x-content-band.bg-image.parallax, .x-content-band.bg-pattern.parallax {
            background-attachment: fixed;
        }

        .contact-button-link {
            font-size: 14px;
            width: 175px;
        }

        a:hover, .widget.widget_text ul li a:hover, .widget.widget_text ol li a:hover,
        .x-twitter-widget ul li a:hover {
            color: #2d824c;
        }

        .rev_slider_wrapper, a.x-img-thumbnail:hover, .x-slider-container.below,
        .page-template-template-blank-3-php .x-slider-container.above,
        .page-template-template-blank-6-php .x-slider-container.above {
            border-color: #2ecc71;
        }

        .x-main {
            width: 69.536945%;
        }

        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
            font-style: normal;
            font-weight: 900;
            letter-spacing: 0;
            text-transform: uppercase;
        }

        .x-container.width {
            width: 88%;
        }

        .x-container.max {
            max-width: 1200px;
        }

        .x-main.full {
            float: none;
            display: block;
            width: auto;
        }

        h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, h1 a, h2 a, h3 a,
        h4 a, h5 a, h6 a, .h1 a, .h2 a, .h3 a, .h4 a, .h5 a, .h6 a, blockquote {
            color: #272727;
        }

        body.x-navbar-fixed-top-active .x-navbar-wrap {
            height: 54px;
        }

        .x-navbar-inner {
            min-height: 54px;
        }

        .x-brand {
            font-size: 44px;
            font-size: 4.4rem;
        }

        .tco.home .x-navbar .x-nav > li {
            width: 13.5%;
        }

        .my-bottom-img #main-title {
            background-color: rgba(0, 0, 0, 0.6);
            padding: 10px;
            text-align: center;
        }

        .my-bottom-img #main-title h1 {
            font-size: 200%
        }

        .my-bottom-img {
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 65px;
            line-height: 1;
        }

        .blueimp-gallery-link {
            display: none;
        }

        h1 span.agent, h1 span.subtitle {
            font-size: 100%;
            color: #fff;
            margin-bottom: 15px;
            letter-spacing: 2px;
            font-weight: 500;
            display: block;
        }

        h1 span.agent {
            font-weight: 100;
        }

        h1 span.address-price {
            font-size: 20px;
            color: #fff;
            display: block;
            font-weight: 100;
            letter-spacing: 2px;
            margin-top: 10px;
        }

        h1.intro {
            margin: 0;
        }

        h1.intro hr {
            color: #fff;
            width: 50%;
            margin: auto;
            margin-bottom: 15px;
        }

        .blueimp-gallery-main-click {
            cursor: pointer;
        }

        #banner {
            font-family: 'Lato', Helvetica, Arial, sans-serif;
            font-weight: 700;
            text-transform: uppercase;
            position: absolute;
            display: block;
            top: 1px;
            right: 40px;
            width: auto;
            font-size: 18px;
            line-height: 50px;
            text-transform: uppercase;
            color: #fff;
            background: rgba(255, 0, 0, 0.75);
            padding: 0 30px;
        }

        .footer-column {
            width: 33%;
            float: left;
        }

        .dc-flex-control-nav li {
            padding: 1em 0;
            text-align: center;
        }

        .gallery .the-stacks {
            padding-top: 50px;
        }

        .gallery .the-stacks img {
            max-width: 90%;
            margin-bottom: 10px;
        }

        .gallery .the-stacks .blueimp-gallery-main-click .h2 {
            font-size: 165.7%;
        }

        .features div.p-pages {
            margin-top: 25px;
            font-size: 15px;
            max-height: 500px;
            overflow: auto;
        }

        .blueimp-gallery > .slides > .slide > .text-content {
            overflow: auto;
            margin: 60px auto;
            padding: 0 60px;
            max-width: 920px;
            text-align: left;
        }

        .any-pages iframe {
            width: 100%;
        }

        .custom-nav {
            margin: 0 auto;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            /*text-align: center;*/
            z-index: 9999;
            box-shadow: 0px 0px 9px rgba(0, 0, 0, 0.15);
            background-color: #fff;
            height: 52px;
        }

        .custom-nav ul {
            text-align: left;
            display: inline;
            margin: 0;
            padding: 0;

        }

        .custom-nav ul ul {
            display: none;
            margin: 0;
        }

        .custom-nav ul li:hover > ul {
            display: block;
        }

        .custom-nav ul {
            /*height: 45px;*/
            background: #fff;

            list-style: none;
            position: relative;
            display: inline-table;
        }

        .custom-nav ul:after {
            content: "";
            clear: both;
            display: block;
        }

        .custom-nav ul li {
            float: left;
        }

        .custom-nav ul li:hover {
            background: #2C6CAB;
        }

        .custom-nav ul li:hover a {
            color: #fff;
        }

        .custom-nav ul li a {
            color: #333;
            font-weight: 600;
            display: block;
            padding: 15px;
            text-decoration: none;
            text-transform: uppercase;
        }

        .custom-nav ul ul {
            background: #fff;
            border-radius: 0px;
            padding: 0;
            position: absolute;
            top: 100%;
        }

        .custom-nav ul ul li {
            border-bottom: 1px solid #fff;
            border-top: 1px solid #fff;
            float: none;
            min-width: 200px;
            position: relative;
        }

        .custom-nav ul ul li a {
            padding: 12px 35px;
            color: #333 !important;
            text-align: left;
        }

        .custom-nav ul ul li a:hover {
            background: #2C6CAB;
            color: #fff !important;
        }

        .custom-nav ul ul ul {
            position: absolute;
            left: 100%;
            top: 0;
            color: #333;
        }
    </style>
</head>

<body>
<!-- Start menu area -->
<div class="nav-header">
    <div class="broker-logo"
         style="border-right: 2px solid grey; float: left; padding: 0 !important;">
        <a href="index.html">
            <img id="broker-logo-image" src="img/logo.png" width="250" alt="durhamcondos"/>
        </a>
    </div>
    <div class="nav-linker">
        <a class="nav-link" href="index.html">HOME</a>
        <a class="nav-link" href="about.html">ABOUT</a>
        <div class="dropdown">
            <a id="dLabel" role="button" data-toggle="dropdown" data-target="#" href="#"> SEARCH CONDOS</a>
            <ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                <li class="dropdown-submenu">
                    <a tabindex="-1" href="#">CONDOS BY CITY</a>
                    <ul class="dropdown-menu">
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Ajax%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=13&mapCenter=43.831624213818316,-79.02347525927736">AJAX</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Townhouse,Condo%20Apt%22%7D,%7B%22FilterName%22:%22Common%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22bowmanville%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=13&mapCenter=43.91014024565906,-78.68819230547678">BOWMANVILLE</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Community%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Brooklin%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=15&mapCenter=43.95659152553518,-78.95834321680158">BROOKLIN</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Townhouse,Condo%20Apt%22%7D,%7B%22FilterName%22:%22Community%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Courtice%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=14&mapCenter=43.90840291068838,-78.78519418021338">COURTICE</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Townhouse,Condo%20Apt%22%7D,%7B%22FilterName%22:%22Common%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22newcastle%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=14&mapCenter=43.9084385928228,-78.58565027838314">NEWCASTLE</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22List_Price%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%22250000%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Oshawa%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=13&mapCenter=43.91318423805784,-78.8597613990503">OSHAWA</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Common%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22pickering%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=14&mapCenter=43.83695437040898,-79.07211625171774">PICKERING</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Common%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22whitby%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=13&mapCenter=43.87662507836452,-78.92709012467793">WHITBY</a></li>
                    </ul>
                </li>
                <li class="dropdown-submenu">
                    <a tabindex="-1" href="#">CONDOS BY BEDROOMS</a>
                    <ul class="dropdown-menu">
                        <li><a tabindex="-1" href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22Bedrooms%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%221%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Pickering,Ajax,Whitby,Oshawa,Clarington%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=11&mapCenter=43.8932038438175,-78.8506149812453">1 OR MORE</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22Bedrooms%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%222%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Pickering,Ajax,Whitby,Oshawa,Clarington%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=11&mapCenter=43.8932038438175,-78.8506149812453">2 OR MORE</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22Bedrooms%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%223%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Pickering,Ajax,Whitby,Oshawa,Clarington%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=11&mapCenter=43.8932038438175,-78.8506149812453">3 OR MORE</a></li>
                    </ul>
                </li>
                <li class="dropdown-submenu">
                    <a tabindex="-1" href="#">CONDOS BY PRICE</a>
                    <ul class="dropdown-menu">
                        <li><a tabindex="-1" href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22List_Price%22,%22FilterOperator%22:%22%3C=%22,%22FilterValues%22:%22400000%22%7D,%7B%22FilterName%22:%22Bedrooms%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%221%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Pickering,Ajax,Whitby,Oshawa,Clarington%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=11&mapCenter=43.8932038438175,-78.8506149812453">UNDER $400 000</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22List_Price%22,%22FilterOperator%22:%22%3C=%22,%22FilterValues%22:%22500000%22%7D,%7B%22FilterName%22:%22Bedrooms%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%221%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Pickering,Ajax,Whitby,Oshawa,Clarington%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=11&mapCenter=43.8932038438175,-78.8506149812453">UNDER $500 000</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22List_Price%22,%22FilterOperator%22:%22%3C=%22,%22FilterValues%22:%22600000%22%7D,%7B%22FilterName%22:%22Bedrooms%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%221%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Pickering,Ajax,Whitby,Oshawa,Clarington%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=11&mapCenter=43.8932038438175,-78.8506149812453">UNDER $600 000</a></li>
                        <li><a href="http://search.durhamcondos.ca/Search/Search?FilterItems=%5B%7B%22FilterName%22:%22Sale_Lease%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Sale%22%7D,%7B%22FilterName%22:%22List_Price%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%22600000%22%7D,%7B%22FilterName%22:%22Bedrooms%22,%22FilterOperator%22:%22%3E=%22,%22FilterValues%22:%221%22%7D,%7B%22FilterName%22:%22ALHomeType%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo/co-op%22%7D,%7B%22FilterName%22:%22Type2%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Condo%20Apt%22%7D,%7B%22FilterName%22:%22Municipality%22,%22FilterOperator%22:%22=%22,%22FilterValues%22:%22Pickering,Ajax,Whitby,Oshawa,Clarington%22%7D%5D&page=1&orderBy=0&viewType=2&mapZoomLevel=11&mapCenter=43.8932038438175,-78.8506149812453">$600 000 AND ABOVE</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <a class="nav-link" href="buyer.html">BUYER PAGE</a>
        <a class="nav-link" href="seller.html">SELLER PAGE</a>
        <a class="nav-link" href="durham_condos.html">MAP</a>
        <a class="nav-link" href="rental_condos.html">RENTALS</a>
        <a class="nav-link" href="contact.html">CONTACT</a>
    </div>
</div>

<div id="top" class="band-top" style="margin-top:5px;">
    <div id="x-section-9999" class="header-3 x-section bg-image man"
         data-vide-bg="<?php echo htmlspecialchars($page['bg_image_url']) ?>"
         data-x-element="section"
         data-x-params="{&quot;type&quot;:&quot;image&quot;,&quot;parallax&quot;:false}">
        <div class="x-container">
            <div class="content">
                <div class="broker-logo">
                    <a href="index.html">
                        <img id="broker-logo-image" src="img/logo.png" style="height:100px; max-width:none" alt="durhamcondos"/></a></div>
                <div class="my-bottom-img">
                    <div id="main-title">
                        <h1 class="intro">
                            <span class="inner">
                                <span class="agent"><?php echo htmlspecialchars($page['title']) ?></span>
                                <hr/>
                                <span class="subtitle"><?php echo htmlspecialchars($page['title_address']) ?></span>
                                <span class="address-price">scroll down for more info</span>
                            </span>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="site">
    <div class="x-main-home x-main full" role="main">
        <article id="post-8"
                 class="post-8 page type-page status-publish hentry no-post-thumbnail">
            <div class="entry-content">
                <div class="band-stacks" id="stacks">
                    <div id="x-content-band-1"
                         class="x-content-band border-bottom man"
                         style="background-color: transparent; padding-top: 60px; padding-bottom: 70px;">
                        <div class="x-container max width">
                            <h2 class="h-custom-headline center-text">
                                <span>building information<i></i></span>
                            </h2>
                            <hr class="x-gap" style="margin: 32px 0 0 0;"/>
                            <div class="x-container max width">
                                <!-- last few sales -->
                                <div class="x-column x-sm x-1-1 last " style="text-align:justify">
                                    <?php echo $page['text'] ?>
                                    <hr/>
                                    <div class="right-table">
                                        <table class="table table-striped">
                                            <?php if ($page['units']) { ?>
                                                <tr>
                                                    <th>Units</th>
                                                    <td><?php echo $page['units'] ?></td>
                                                </tr>
                                            <?php } ?>

                                            <?php if ($page['floors']) { ?>
                                                <tr>
                                                    <th>Floors</th>
                                                    <td><?php echo $page['floors'] ?></td>
                                                </tr>
                                            <?php } ?>

                                            <?php if ($page['built_years']) { ?>
                                                <tr>
                                                    <th>Built</th>
                                                    <td><?php echo htmlspecialchars($page['built_years']) ?></td>
                                                </tr>
                                            <?php } ?>

                                            <?php if ($page['fee_from']) { ?>
                                                <tr>
                                                    <th>Condo Fees</th>
                                                    <td>
                                                        $<?php echo $page['fee_from'] ?><?php echo $page['fee_to'] ? ' - $' . $page['fee_to'] : '' ?></td>
                                                </tr>
                                            <?php } ?>

                                            <tr>
                                                <th>Includes Heating</th>
                                                <td><?php echo $page['is_heating_included'] ? 'Yes' : 'No' ?></td>
                                            </tr>

                                            <?php if ($page['property_manager']) { ?>
                                                <tr>
                                                    <th>Property Manager</th>
                                                    <td><?php echo $page['property_manager'] ?></td>
                                                </tr>
                                            <?php } ?>

                                            <?php if ($page['building_name']) { ?>
                                                <tr>
                                                    <th>Building name</th>
                                                    <td><?php echo htmlspecialchars($page['building_name']) ?></td>
                                                </tr>
                                            <?php } ?>

                                            <tr>
                                                <th>Pets Permitted</th>
                                                <td><?php echo $page['is_pets_permitted'] ? 'Yes' : 'No' ?></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <?php if ($firstImage) { ?>
                            <div class="band-experts" id="video-tour">
                                <div id="x-content-band-6"
                                     class="x-content-band center-text border-bottom man"
                                     style="background-color: transparent; padding-top: 40px; padding-bottom: 75px;">
                                    <?php if ($page['tour_url']){ ?>
                                    <div class="x-container max width">
                                        <h2 class="h-custom-headline center-text">
                                            <span>Virtual Tour<i></i></span>
                                        </h2>

                                        <hr class="x-gap" style="margin: 32px 0 0 0;"/>

                                        <div class="x-video embed man with-container visible-xs">
                                            <div class="x-video-inner"><a href="<?php echo $page['tour_url']; ?>"
                                                                          target="_blank"><img
                                                            src="img/virtualtour.jpg"/></a></div>
                                        </div>

                                        <div class="x-video embed man with-container hidden-xs">
                                            <div class="x-video-inner">
                                                <iframe src="<?php echo $page['tour_url']; ?>" width="800" height="600"
                                                        allowFullScreen="" frameborder="0"></iframe>
                                            </div>
                                        </div>

                                        <?php } ?>
                                        <br/>
                                        <br/>

                                        <h2 class="h-custom-headline center-text">
                                            <span><i>Additional photos</i></span>
                                        </h2>
                                    </div>
                                </div>

                                <div class="x-container max width">
                                    <div class="the-stacks">
                                        <div class="parent-stack">
                                            <div class="x-column x-sm x-1-2 last blueimp-gallery-main-click text-center">
                                                <img src="<?php echo htmlspecialchars($firstImage['image_url']) ?>"
                                                     alt="additional photos" width="600" height="450"/>
                                            </div>

                                            <div class="blueimp-gallery-link">
                                                <?php foreach ($images as $image) { ?>
                                                    <a href="<?php echo htmlspecialchars($image['image_url']) ?>"></a>
                                                <?php } ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="band-pages" id="pages-25477">
                    <div id="x-content-band-11"
                         class="x-content-band bg-image parallax man"
                         data-x-element="content_band"
                         data-x-params="{&quot;type&quot;:&quot;image&quot;,&quot;parallax&quot;:true}"
                         style="background-image: url('img/para.jpg'); background-color: transparent; padding-top: 115px; padding-bottom: 115px;">
                    </div>
                </div>

                <div class="band-experts" id="video-tour">
                    <div id="x-content-band-6"
                         class="x-content-band center-text border-bottom man"
                         style="background-color: transparent; padding-top: 60px; padding-bottom: 75px;">
                        <div class="x-container max width">
                            <h2 class="h-custom-headline center-text">
                                <span>Floor plans<i></i></span>
                            </h2>

                            <hr class="x-gap" style="margin: 32px 0 0 0;"/>

                            <div class="x-container max width">
                                <div class="x-column x-sm x-1-1 last" style="text-align:justify">
                                    <table class="table table-striped">
                                        <?php if (count($plans)) { ?>
                                            <?php for ($i = 0; $i < count($plans) / 2; $i++) { ?>
                                                <tr>
                                                    <td>
                                                        <a href="<?php echo htmlspecialchars($plans[$i * 2]['url']) ?>"><?php echo htmlspecialchars($plans[$i * 2]['title']) ?></a>
                                                    </td>
                                                    <td>
                                                        <?php if (isset($plans[$i * 2 + 1])) { ?>
                                                            <a href="<?php echo htmlspecialchars($plans[$i * 2 + 1]['url']) ?>"><?php echo htmlspecialchars($plans[$i * 2 + 1]['title']) ?></a>
                                                        <?php } else { ?>
                                                            &nbsp;
                                                        <?php } ?>
                                                    </td>
                                                </tr>
                                            <?php } ?>
                                        <?php } else { ?>
                                            <tr>
                                                <th>None at this time</th>
                                                <th></th>
                                            </tr>
                                        <?php } ?>
                                    </table>
                                </div>
                            </div>


                            <?php if (count($history)) { ?>
                                <br/>
                                <br/>

                                <div class="x-column x-sm x-1-1 last" style="text-align:justify">
                                    <h2 class="h-custom-headline center-text">
                                        <span>Historical pricing<i></i></span>
                                    </h2>

                                    <div class="x-gap" style="margin: 32px 0 0 0;">
                                        <div class="x-container max width">
                                            <!-- last few sales -->
                                            <div style="width:100%;">
                                                <!--<script type="text/javascript" src="https://www.google.com/jsapi?autoload={'modules':[{'name':'visualization','version':'1','packages':['corechart']}]}"></script>-->
                                                <script src="https://www.gstatic.com/charts/loader.js"></script>
                                                <div id="ex0"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <script type="application/javascript">
                                    // google.load('visualization', '3.3', {packages: ['corechart']});
                                    google.charts.load('current', {packages: ['corechart']});
                                    google.setOnLoadCallback(drawChart);

                                    function drawChart() {

                                        var data = new google.visualization.DataTable();
                                        data.addColumn('string', 'year');
                                        data.addColumn('number', 'Average Price');
                                        data.addRows([
                                            <?php foreach ($history as $historyRow) { ?>
                                            <?php echo '["' . $historyRow["year"] . '", ' . $historyRow["price"] . ']'; ?>
                                            <?php echo ','; ?>
                                            <?php } ?>
                                        ]);

                                        var chart = new google.visualization.LineChart(document.getElementById('ex0'));
                                        chart.draw(data, null);
                                    }
                                </script>
                            <?php } ?>
                        </div>
                    </div>
                </div>

                <?php if ($page['map_url']) { ?>
                    <div class="band-customizer" id="customizer">
                        <div id="x-content-band-7" class="x-content-band man"
                             style="background-color: transparent; padding-top: 0px; padding-bottom: 0;">
                            <div class="x-container max width">
                                <!-- MAP & DIRECTIONS -->
                                <div class="x-column x-sm x-1-1 last" style="">
                                    <h2 class="h-custom-headline center-text">
                                        <span>Map<i></i></span>
                                    </h2>

                                    <br/>
                                    <br/>

                                    <article class="subpage-inner" id="page_mapdirections">
                                        <div class="google_map" id="mapdirections">
                                            <div class="map_overlay" onClick="style.pointerEvents='none'"></div>
                                            <iframe src="<?php echo $page['map_url'] ?>" width="100%" height="500"
                                                    frameborder="0" style="border: 0" allowfullscreen></iframe>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php } ?>
        </article>
        <!-- Added by Jerez Bain -->
        <!-- Floating Listings Buttons-->
        <div class="container buttons-bar" data-spy="affix" data-offset-bottom="200">
            <div class="row">
                <div class="col-xs-12 text-center hidden-xs">
                    <?php if ($page['listing_url']) {
                        $listing_url = $page['listing_url'];
                    } else {
                        $listing_url = "http://listings.durhamcondos.ca/index.asp?PageAction=searchresult&SortOrder=highest&searchDetails=$street&priceRangeFrom=any&priceRangeTo=any&Type2=any&type2=$type&bedrooms=any&bathrooms=any&garages=any&submit.x=-669&submit.y=-320&submit=submit&&Street_Name=$street&Municipality=$municipality";
                    } ?>
                    <a href="<?php echo $listing_url; ?>"
                       class="btn btn-primary btn-lg cb-ancor" role="button">
                        <strong>AVAILABLE LISTINGS</strong>
                    </a>
                    <a href="<?php echo $page['alert_url'] ?>" class="btn btn-primary btn-lg cb-ancor" role="button">
                        <strong>RECENT SALES</strong>
                    </a>
                </div>
                <div class="col-xs-12 text-center visible-xs">
                    <a href="<?php echo $listing_url; ?>"
                       class="btn btn-primary cb-ancor" role="button">
                        AVAILABLE LISTINGS
                    </a>
                    <a href="<?php echo $page['alert_url'] ?>" class="btn btn-primary cb-ancor" role="button">
                        RECENT SALES
                    </a>
                </div>
            </div>
        </div>
        <!-- !Added by Jerez Bain -->
    </div>
</div>

<br/>
<br/>
<br/>
<!-- END #top.site -->

<div align="center">
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

    <!-- responsive -->
    <ins class="adsbygoogle"
         style="display: block"
         data-ad-client="ca-pub-2442607298200932"
         data-ad-slot="6229059475"
         data-ad-format="auto"></ins>

    <script type="application/javascript">
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>

<!-- Start Footer -->
<footer>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="footer-text">
                    <p id="middle-text" align="center">
                    <p>Mike Bouma, Broker | RE/MAX JAZZ Inc,. Brokerage | 193 King Street East Oshawa, L1H 1C2 | (905)
                        434.5452 Copyright 2016 DurhamCondos.ca - All Rights Reserved
                    <p> All contents of this site are deemed reliable but not guaranteed and is for informational
                        purposes only. Neither Mike Bouma, RE/MAX JAZZ Inc., Brokerage nor durhamcondos.ca shall be
                        responsible for any errors herein.</p>
                </div>
            </div>
        </div>
    </div>
</footer>
<!-- End Footer -->

<div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls">
    <div class="slides"></div>
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="close">×</a>
    <a class="play-pause"></a>
    <ol class="indicator"></ol>
</div>

<!--
    <div id="contact-buttons-bar" class="slide-on-scroll" >
        <a href="http://listings.durhamcondos.ca/index.asp?PageAction=searchresult&SortOrder=highest&searchDetails=2+westney&priceRangeFrom=any&priceRangeTo=any&Type2=any&type2=condo+apt&bedrooms=any&bathrooms=any&garages=any&submit.x=-669&submit.y=-320&submit=submit&&Street_Name=2+westneyn&Municipality=Ajax" class="contact-button-link cb-ancor">
        <strong>AVAILABLE LISTINGS</strong> </a>
        <a href="<?php echo $page['alert_url'] ?>" class="contact-button-link cb-ancor">
        <strong>GET LISTINGS ALERTS</strong> </a>
    </div>
    -->

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script type='text/javascript' src='wp/wp-content/themes/x-child-custom/framework/js/x-custom.js'></script>
<script type='text/javascript'
        src='wp/wp-content/themes/x/framework/js/dist/site/x-body-mod.min8603.js?ver=4.0.6'></script>
<script type='text/javascript' src='wp/wp-includes/js/comment-reply.min9c92.js?ver=4.2.3'></script>
<script type='text/javascript'
        src='wp/wp-content/plugins/cornerstone/assets/js/dist/site/cs-body.min97de.js?ver=1.0.5'></script>
<script src="wp/wp-content/plugins/blueimp-gallery/js/blueimp-gallery.min.js"></script>

<script type='text/javascript'
        src='wp/wp-includes/js/mediaelement/mediaelement-and-player.min3819.js?ver=2.16.2'></script>

<script type="text/javascript">
    jQuery.noConflict();
    (function ($) {
        $(function () {
            // set logo widh and height
            var screenImage = $("#broker-logo-image");

            // Create new offscreen image to test
            var theImage = new Image();
            theImage.src = screenImage.attr("src");

            // Get accurate measurements from that.
            var imageWidth = theImage.width;
            var imageHeight = theImage.height;

            if ((imageWidth - imageHeight) < 20) {
                $("#broker-logo-image").css("height", 80);
            }

            $(".blueimp-gallery-link").click(function (event) {
                event = event || window.event;
                var target = event.target || event.srcElement,
                    link = target.src ? target.parentNode : target,
                    options = {index: link, event: event, hidePageScrollbars: false},
                    links = this.getElementsByTagName('a');
                gallery = blueimp.Gallery(links, options);

                // hardcoded auto play for this site
            })

            $(".blueimp-gallery-main-click").click(function (event) {
                var parent = $(this).closest(".parent-stack");
                parent.find(".blueimp-gallery-link").trigger("click");
            })

            // assuming iframe url see property
            if ($(".colorbox").length > 0) {
                var url = $(".colorbox").attr("href");

                $(".colorbox").click(function () {
                    var width = $(window).width();
                    var iframeWidth;
                    if (width > 950) {
                        iframeWidth = 950;
                    } else {
                        iframeWidth = width - 50;
                    }

                    $.featherlight({
                        iframe: url,
                        iframeWidth: iframeWidth,
                        iframeHeight: 660
                    });

                    return false;
                });
            }

            $('body').on('contextmenu', 'img', function (e) {
                return false;
            });
            $('img').on('dragstart', function (event) {
                event.preventDefault();
            });
            $('img').attr("draggable", false);
        });
    })(jQuery);

    window.ondragstart = function () {
        return false;
    }
</script>

<script src="clarington/condos/lib/Vide-master/src/jquery.vide.js"></script>
<script src="js/classie.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/map.js"></script>
<script src="js/main.js"></script>

<script src="lib/Vide-master/src/jquery.vide.js"></script>
<script src="lib/jQuery-Plugin-For-Floating-Social-Share-Contact-Sidebar/js/jquery.contact-buttons.js"></script>
<!--<script src="lib/jQuery-Plugin-For-Floating-Social-Share-Contact-Sidebar/js/demo.js"></script>-->

<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
<script>
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-2931382-7', 'auto', {'allowLinker': true});
    ga('require', 'linker');
    ga('linker:autoLink', ['listings.durhamcondos.ca']);
    ga('send', 'pageview');
</script>

<!--Start of Zendesk Chat Script-->
<script type="text/javascript">
    window.$zopim || (function (d, s) {
        var z = $zopim = function (c) {
            z._.push(c)
        }, $ = z.s =
            d.createElement(s), e = d.getElementsByTagName(s)[0];
        z.set = function (o) {
            z.set._.push(o)
        };
        z._ = [];
        z.set._ = [];
        $.async = !0;
        $.setAttribute("charset", "utf-8");
        $.src = "https://v2.zopim.com/?DJIY6nW8ltu7zgy3ATyxrQSbFzJanldp";
        z.t = +new Date;
        $.type = "text/javascript";
        e.parentNode.insertBefore($, e)
    })(document, "script");
</script>
<!--End of Zendesk Chat Script-->
</body>
</html>

