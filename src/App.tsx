import React, { useEffect, useState } from 'react';
import './App.css';
import { deliveryClient } from './deliveryClient';
import { LandingPage, WebSpotlightRoot, contentTypes } from './models';
// import KontentSmartLink from '@kontent-ai/smart-link';
import KontentSmartLink from '@kontent-ai/smart-link' 

function App() {
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);

  // Retrieves the Website root item and saves the linked Landing page
  useEffect(() => {
    deliveryClient.item<WebSpotlightRoot>('ku_root_item')
      .toPromise()
      .then(
        response => (
          // Website root uses the 'Content' element to link the Landing page
          setLandingPage(response.data.item.elements.content.linkedItems[0])
        )
      )
  }, [])

  // Set up Smart Link SDK
  useEffect(() => {
    const kontentSmartLink = KontentSmartLink.initialize({
      defaultDataAttributes: {
        projectId: process.env.REACT_APP_KONTENT_AI_ENVIRONMENT_ID,
        languageCodename: "default"
      },
      queryParam: "preview"
    });

    return () => {
      kontentSmartLink.destroy();
    };
  }, []);

  return (
    <div className="App">
      {landingPage && (
        // Specifies a content item ID using data attribute
        <div className="App-header" data-kontent-item-id={landingPage.system.id}>
          <img
            // Specifies an element codename using a strongly typed model
            data-kontent-element-codename={contentTypes.landing_page.elements.image.codename}
            className="App-logo"
            src={landingPage.elements.add_cover_image.value[0]?.url}
            // If an asset doesn't have an alt text description, use its file name
            alt={landingPage.elements.add_cover_image.value[0]?.description ||
              landingPage.elements.add_cover_image.value[0]?.name}
            height={landingPage.elements.add_cover_image.value[0]?.height || 200}
            width={landingPage.elements.add_cover_image.value[0]?.width || 300}
          />
          <h1
            data-kontent-element-codename={contentTypes.landing_page.elements.title.codename}>
            {landingPage.elements.add_a_title.value}
          </h1>
          <h3
            data-kontent-element-codename={contentTypes.landing_page.elements.title.codename}>
            {landingPage.elements.add_description.value}
          </h3>
          <div
            data-kontent-element-codename={contentTypes.landing_page.elements.body.codename}
            dangerouslySetInnerHTML={{ __html: landingPage.elements.add_content.value }}>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
