import React from "react";

export default function BlogPost(props) {
  console.log(props);
  const { data } = props;
  return (
    <>
      <div>BlogPost</div>
    </>
  );
}

export async function getServerSideProps(context) {
  console.log("context", context?.params);
  const { slug } = context.params;
  // Fetch data from external API
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`);
  const data = await res.json();
  // Pass data to the page via props
  return { props: { data } };
}
