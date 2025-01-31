import React from 'react'
import HomePageVideoBody from "@/components/homepage/homePageComponents/HomePageVideoBody";
import IntroductionBody from "@/components/homepage/homePageComponents/IntroductionBody";
import FeaturesBody from "@/components/homepage/homePageComponents/FeaturesBody";
import DemoListSection from "@/components/homepage/homePageComponents/DemoListSection";
import PlanSection from "@/components/homepage/homePageComponents/PlanSection";
import MobileBottomAdBanner from './homePageComponents/MobileBottomAdBanner';
import MiddleMessage from './homePageComponents/MiddleMessage';
import styles from "./HomePageBody.module.scss";

export default function HomePageBody() {

  return (
    <main className={styles["home-page-body-container"]}>
    <HomePageVideoBody/>
    <MiddleMessage/>
    <IntroductionBody/>
    <DemoListSection/>
    <PlanSection/>
    <MobileBottomAdBanner/>
  </main>
  )
}
