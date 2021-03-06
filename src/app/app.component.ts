import { Component } from '@angular/core';
// var data = require('src/crawldates.json'); 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "Casey's page comparison";

  selectedUrl = "vehicles";
  mobile = false;
  //function 
  onSelect(a: string) {
    if(this.mobile == true && a.substring(0, 7) != "mobile_") { // add substring check for first 7 characters
      this.selectedUrl = "mobile_" + a;
      this. title = a + " mobile";
    } else {
      if (a.substring(0, 7) == "mobile_") {
        (a = a.substring(7));
      }
      this.selectedUrl = a;
      this.title = a;
      //return a;
    }
  };

  selectDesktopOrMobile(k: boolean, currentUrl) {
    this.mobile = k;
    this.onSelect(currentUrl);
  }

  // these are here for angular. The url menu loops through this - they are formatted the same as 
  // the picture extensions

  sharedUrlArray = [
    'trade_in_value',
    'contact_dealer',
    'favorites',
    'landing',
    'landing_college_grad',
    'landing_military_rebate',
    'landing_parts_and_service',
    'request_a_quote',
    'inventory',
    'payment_estimator',
    'tools',
    // 'tools_toyota_safety_sense', //problem link?
    'dealers',
    'vehicles',
    'vehicles_86',
    'vehicles_avalon',
    'vehicles_camry',
    'vehicles_corolla',
    'vehicles_corollahatchback',
    'vehicles_sienna',
    'vehicles_yaris',
    'vehicles_yarisliftback',
    'vehicles_tacoma',
    'vehicles_tundra',
    'vehicles_4runner',
    'vehicles_c_hr',
    'vehicles_highlander',
    'vehicles_landcruiser',
    'vehicles_rav4',
    'vehicles_sequoia',
    'vehicles_avalonhybrid',
    'vehicles_camryhybrid',
    'vehicles_highlanderhybrid',
    'vehicles_prius',
    'vehicles_priusprime',
    'vehicles_priusc',
    'vehicles_rav4hybrid',
    'offers',
    'offers_86',
    'offers_avalon',
    'offers_camry',
    'offers_corolla',
    'offers_corollahatchback',
    'offers_sienna',
    'offers_yaris',
    'offers_yarisliftback',
    'offers_tacoma',
    'offers_tundra',
    'offers_4runner',
    'offers_c_hr',
    'offers_highlander',
    'offers_landcruiser',
    'offers_rav4',
    'offers_sequoia',
    'offers_avalonhybrid',
    'offers_camryhybrid',
    'offers_highlanderhybrid',
    'offers_prius',
    'offers_priusprime',
    'offers_priusc',
    'offers_rav4hybrid',
    'offers_corollaim',
    'offers_yarisia',
    'offers_mirai',
    'offers_apr',
    'offers_cash',
    'offers_lease',
    'offers_msrp',
    'offers_misc',
    'compare',
    'compare_19_86_civic_page',
    'compare_19_avalon_maxima_page',
    'compare_19_camry_accord_page',
    'compare_19_corolla_civic_page',
    'compare_19_Corolla_Hatchback_Elantra_page',
    'compare_19_sienna_odyssey_page',
    // 'compare_?series=yaris',
    // 'compare_?series=yarisliftback',
    'compare_19_tacoma_frontier_page',
    'compare_19_tundra_f150_page',
    'compare_19_4runner_pathfinder_page',
    'compare_19_c_hr_hr_v_page',
    'compare_19_highlander_acadia_page',
    'compare_19_landcruiser_rangerover_page',
    'compare_19_rav4_rogue_page',
    // 'compare_?series=sequoia',
    'compare_19_avalonhybrid_mkz_page',
    // 'compare_19_camryhybrid_malibu_page',
    // 'compare_?series=highlanderhybrid',
    // 'compare_?series=prius',
    'compare_18_priusprime_fusion_page',
    'compare_19_priusc_insight_page',
    'compare_18_rav4hybrid_rogue_page',
    'compare_index_page',
    'Home_page',
    'schedule_a_test_drive',
    // 'legal',
    'about',
    // 'inventory#cars_n_minivan',
    // 'inventory#trucks',
    // "inventory#crossovers-n-suvs",
    // "inventory#hybrids-n-evs",
    // "vehicles#cars-n-minivan",
    // "vehicles#trucks",
    // "vehicles#crossovers-n-suvs",
    // "vehicles#hybrids-n-evs",
    // "dealer-directory",
    // "dealer-directory/index.page",
    // "compare#cars-n-minivan",
    // "compare#trucks",
    // "compare#crossovers-n-suvs",
    // "compare#hybrids-n-evs",
    "sitemap",
  ];

  //sharedUrlArray = [
  //  "trade-in-value",
  //  "contact-dealer",
  //  "favorites",
  //  "landing",
  //  "landing/college-grad",
  //  "landing/military-rebate",
  //  "landing/parts-and-service",
  //  "request-a-quote",
  //  "inventory",
  //  "payment-estimator",
  //  "tools",
  //  "tools/toyota-safety-sense",
  //  "dealers",
  //  "vehicles",
  //  "vehicles/86",
  //  "vehicles/avalon",
  //  "vehicles/camry",
  //  "vehicles/corolla",
  //  "vehicles/corollahatchback",
  //  "vehicles/sienna",
  //  "vehicles/yaris",
  //  "vehicles/yarisliftback",
  //  "vehicles/tacoma",
  //  "vehicles/tundra",
  //  "vehicles/4runner",
  //  "vehicles/c-hr",
  //  "vehicles/highlander",
  //  "vehicles/landcruiser",
  //  "vehicles/rav4",
  //  "vehicles/sequoia",
  //  "vehicles/avalonhybrid",
  //  "vehicles/camryhybrid",
  //  "vehicles/highlanderhybrid",
  //  "vehicles/prius",
  //  "vehicles/priusprime",
  //  "vehicles/priusc",
  //  "vehicles/rav4hybrid",
  //  "offers",
  //  "offers/86",
  //  "offers/avalon",
  //  "offers/camry",
  //  "offers/corolla",
  //  "offers/corollahatchback",
  //  "offers/sienna",
  //  "offers/yaris",
  //  "offers/yarisliftback",
  //  "offers/tacoma",
  //  "offers/tundra",
  //  "offers/4runner",
  //  "offers/c-hr",
  //  "offers/highlander",
  //  "offers/landcruiser",
  //  "offers/rav4",
  //  "offers/sequoia",
  //  "offers/avalonhybrid",
  //  "offers/camryhybrid",
  //  "offers/highlanderhybrid",
  //  "offers/prius",
  //  "offers/priusprime",
  //  "offers/priusc",
  //  "offers/rav4hybrid",
  //  "offers/corollaim",
  //  "offers/yarisia",
  //  "offers/mirai",
  //  "offers/apr",
  //  "offers/cash",
  //  "offers/lease",
  //  "offers/msrp",
  //  "offers/misc",
  //  "compare",
  //  "compare/19-86-civic.page",
  //  "compare/19-avalon-maxima.page",
  //  "compare/19-camry-accord.page",
  //  "compare/19-corolla-civic.page",
  //  "compare/19-Corolla-Hatchback-Elantra.page",
  //  "compare/19-sienna-odyssey.page",
  //  "compare/?series=yaris",
  //  "compare/?series=yarisliftback",
  //  "compare/19-tacoma-frontier.page",
  //  "compare/19-tundra-f150.page",
  //  "compare/19-4runner-pathfinder.page",
  //  "compare/19-c-hr-hr-v.page",
  //  "compare/19-highlander-acadia.page",
  //  "compare/19-landcruiser-rangerover.page",
  //  "compare/19-rav4-rogue.page",
  //  "compare/?series=sequoia",
  //  "compare/19-avalonhybrid-mkz.page",
  //  "compare/19-camryhybrid-malibu.page",
  //  "compare/?series=highlanderhybrid",
  //  "compare/?series=prius",
  //  "compare/18-priusprime-fusion.page",
  //  "compare/19-priusc-insight.page",
  //  "compare/18-rav4hybrid-rogue.page",
  //  "compare/index.page",
  //  "Home.page",
  //  "schedule-a-test-drive",
  //  "legal",
  //  "about",
  //  "inventory#cars-n-minivan",
  //  "inventory#trucks",
  //  "inventory#crossovers-n-suvs",
  //  "inventory#hybrids-n-evs",
  //  "vehicles#cars-n-minivan",
  //  "vehicles#trucks",
  //  "vehicles#crossovers-n-suvs",
  //  "vehicles#hybrids-n-evs",
  //  "dealer-directory",
  //  "dealer-directory/index.page",
  //  "compare#cars-n-minivan",
  //  "compare#trucks",
  //  "compare#crossovers-n-suvs",
  //  "compare#hybrids-n-evs",
  //  "sitemap",
  //]
}
