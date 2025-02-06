import React from 'react'
import HomePageVideoBody from "@/components/homepage/homePageComponents/HomePageVideoBody";
import IntroductionBody from "@/components/homepage/homePageComponents/IntroductionBody";
import DemoListSection from "@/components/homepage/homePageComponents/DemoListSection";
import PlanSection from "@/components/homepage/homePageComponents/PlanSection";
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
  </main>
  )
}
