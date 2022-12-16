import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import toast, { Toaster } from "react-hot-toast";

import { trpc, RouterOutputs } from "@calcom/trpc/react";
import { Icon } from "@calcom/ui";
import { Loader } from "@calcom/ui";
import { Button, Avatar } from "@calcom/ui/components/";
import Dropdown, {
  DropdownItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@calcom/ui/v2/core/Dropdown";

// import { SkeletonContainer, SkeletonText, SkeletonAvatar, SkeletonButton } from "@calcom/ui/v2/core/skeleton";
import { httpBatchLink } from "@trpc/client";

import "../styles/fonts.css";
import "../styles/globals.css";

type EventTypeGroup = RouterOutputs["viewer"]["eventTypes"]["getByViewer"]["eventTypeGroups"][number];
// type EventType = EventTypeGroup["eventTypes"][number];

// interface EventTypeListProps {
//   group: EventTypeGroup;
//   groupIndex: number;
//   readOnly: boolean;
//   types: EventType[];
// }

// const Item = ({ type, group, readOnly }: { type: EventType; group: EventTypeGroup; readOnly: boolean }) => {
//   return (
//     <Link href={`/event-types/${type.id}?tabName=setup`}>
//       <a
//         className="flex-1 overflow-hidden pr-4 text-sm"
//         title={`${type.title} ${type.description ? `– ${type.description}` : ""}`}>
//         <div>
//           <span
//             className="font-semibold text-gray-700 ltr:mr-1 rtl:ml-1"
//             data-testid={"event-type-title-" + type.id}>
//             {type.title}
//           </span>
//           <small
//             className="hidden font-normal leading-4 text-gray-600 sm:inline"
//             data-testid={"event-type-slug-" + type.id}>{`/${group.profile.slug}/${type.slug}`}</small>
//           {readOnly && (
//             <span className="rtl:mr-2inline items-center rounded-sm bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-800 ltr:ml-2">
//               {t("readonly") as string}
//             </span>
//           )}
//         </div>
//         {/* <EventTypeDescription eventType={type} /> */}
//       </a>
//     </Link>
//   );
// };

// const MemoizedItem = React.memo(Item);

// const EventsList = ({ group, groupIndex, readOnly, types }: EventTypeListProps): JSX.Element => {
//   const router = useRouter();
//   const [parent] = useAutoAnimate<HTMLUListElement>();
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [deleteDialogTypeId, setDeleteDialogTypeId] = useState(0);
//   const utils = trpc.useContext();
//   const mutation = trpc.viewer.eventTypeOrder.useMutation({
//     onError: async (err) => {
//       console.error(err.message);
//       await utils.viewer.eventTypes.getByViewer.cancel();
//       // REVIEW: Should we invalidate the entire router or just the `getByViewer` query?
//       await utils.viewer.eventTypes.invalidate();
//     },
//     onSettled: () => {
//       // REVIEW: Should we invalidate the entire router or just the `getByViewer` query?
//       utils.viewer.eventTypes.invalidate();
//     },
//   });

//   const setHiddenMutation = trpc.viewer.eventTypes.update.useMutation({
//     onMutate: async ({ id }) => {
//       await utils.viewer.eventTypes.getByViewer.cancel();
//       const previousValue = utils.viewer.eventTypes.getByViewer.getData();
//       if (previousValue) {
//         const newList = [...types];
//         const itemIndex = newList.findIndex((item) => item.id === id);
//         if (itemIndex !== -1 && newList[itemIndex]) {
//           newList[itemIndex].hidden = !newList[itemIndex].hidden;
//         }
//         utils.viewer.eventTypes.getByViewer.setData(undefined, {
//           ...previousValue,
//           eventTypeGroups: [
//             ...previousValue.eventTypeGroups.slice(0, groupIndex),
//             { ...group, eventTypes: newList },
//             ...previousValue.eventTypeGroups.slice(groupIndex + 1),
//           ],
//         });
//       }
//       return { previousValue };
//     },
//     onError: async (err, _, context) => {
//       if (context?.previousValue) {
//         utils.viewer.eventTypes.getByViewer.setData(undefined, context.previousValue);
//       }
//       console.error(err.message);
//     },
//     onSettled: () => {
//       // REVIEW: Should we invalidate the entire router or just the `getByViewer` query?
//       utils.viewer.eventTypes.invalidate();
//     },
//   });

//   async function moveEventType(index: number, increment: 1 | -1) {
//     const newList = [...types];

//     const type = types[index];
//     const tmp = types[index + increment];
//     if (tmp) {
//       newList[index] = tmp;
//       newList[index + increment] = type;
//     }

//     await utils.viewer.eventTypes.getByViewer.cancel();

//     const previousValue = utils.viewer.eventTypes.getByViewer.getData();
//     if (previousValue) {
//       utils.viewer.eventTypes.getByViewer.setData(undefined, {
//         ...previousValue,
//         eventTypeGroups: [
//           ...previousValue.eventTypeGroups.slice(0, groupIndex),
//           { ...group, eventTypes: newList },
//           ...previousValue.eventTypeGroups.slice(groupIndex + 1),
//         ],
//       });
//     }

//     mutation.mutate({
//       ids: newList.map((type) => type.id),
//     });
//   }

//   async function deleteEventTypeHandler(id: number) {
//     const payload = { id };
//     deleteMutation.mutate(payload);
//   }

//   // inject selection data into url for correct router history
//   const openModal = (group: EventTypeGroup, type: EventType) => {
//     const query = {
//       ...router.query,
//       dialog: "new-eventtype",
//       eventPage: group.profile.slug,
//       title: type.title,
//       slug: type.slug,
//       description: type.description,
//       length: type.length,
//       type: type.schedulingType,
//       teamId: group.teamId,
//     };
//     if (!group.teamId) {
//       delete query.teamId;
//     }
//     router.push(
//       {
//         pathname: router.pathname,
//         query,
//       },
//       undefined,
//       { shallow: true }
//     );
//   };

//   const deleteMutation = trpc.viewer.eventTypes.delete.useMutation({
//     onSuccess: () => {
//       showToast(t("event_type_deleted_successfully"), "success");
//       setDeleteDialogOpen(false);
//     },
//     onMutate: async ({ id }) => {
//       await utils.viewer.eventTypes.getByViewer.cancel();
//       const previousValue = utils.viewer.eventTypes.getByViewer.getData();
//       if (previousValue) {
//         const newList = types.filter((item) => item.id !== id);

//         utils.viewer.eventTypes.getByViewer.setData(undefined, {
//           ...previousValue,
//           eventTypeGroups: [
//             ...previousValue.eventTypeGroups.slice(0, groupIndex),
//             { ...group, eventTypes: newList },
//             ...previousValue.eventTypeGroups.slice(groupIndex + 1),
//           ],
//         });
//       }
//       return { previousValue };
//     },
//     onError: (err, _, context) => {
//       if (context?.previousValue) {
//         utils.viewer.eventTypes.getByViewer.setData(undefined, context.previousValue);
//       }
//       if (err instanceof HttpError) {
//         const message = `${err.statusCode}: ${err.message}`;
//         showToast(message, "error");
//         setDeleteDialogOpen(false);
//       } else if (err instanceof TRPCClientError) {
//         showToast(err.message, "error");
//       }
//     },
//     onSettled: () => {
//       // REVIEW: Should we invalidate the entire router or just the `getByViewer` query?
//       utils.viewer.eventTypes.invalidate();
//     },
//   });

//   const [isNativeShare, setNativeShare] = useState(true);

//   useEffect(() => {
//     if (!navigator.share) {
//       setNativeShare(false);
//     }
//   }, []);

//   const firstItem = types[0];
//   const lastItem = types[types.length - 1];
//   return (
//     <div className="mb-16 flex overflow-hidden rounded-md border border-gray-200 bg-white">
//       <ul ref={parent} className="!static w-full divide-y divide-neutral-200" data-testid="event-types">
//         {types.map((type, index) => {
//           const embedLink = `${group.profile.slug}/${type.slug}`;
//           const calLink = `${CAL_URL}/${embedLink}`;
//           return (
//             <li key={type.id}>
//               <div className="flex w-full items-center justify-between hover:bg-neutral-50">
//                 <div className="group flex w-full max-w-full items-center justify-between overflow-hidden px-4 py-4 sm:px-6">
//                   {!(firstItem && firstItem.id === type.id) && (
//                     <button
//                       className="invisible absolute left-[5px] -mt-4 mb-4 -ml-4 hidden h-6 w-6 scale-0 items-center justify-center rounded-md border bg-white p-1 text-gray-400 transition-all hover:border-transparent hover:text-black hover:shadow disabled:hover:border-inherit disabled:hover:text-gray-400 disabled:hover:shadow-none group-hover:visible group-hover:scale-100 sm:ml-0 sm:flex lg:left-[36px]"
//                       onClick={() => moveEventType(index, -1)}>
//                       <Icon.FiArrowUp className="h-5 w-5" />
//                     </button>
//                   )}

//                   {!(lastItem && lastItem.id === type.id) && (
//                     <button
//                       className="invisible absolute left-[5px] mt-8 -ml-4 hidden h-6 w-6 scale-0 items-center justify-center rounded-md  border bg-white p-1 text-gray-400 transition-all hover:border-transparent hover:text-black hover:shadow disabled:hover:border-inherit disabled:hover:text-gray-400 disabled:hover:shadow-none group-hover:visible group-hover:scale-100 sm:ml-0 sm:flex lg:left-[36px]"
//                       onClick={() => moveEventType(index, 1)}>
//                       <Icon.FiArrowDown className="h-5 w-5" />
//                     </button>
//                   )}
//                   <MemoizedItem type={type} group={group} readOnly={readOnly} />
//                   <div className="mt-4 hidden sm:mt-0 sm:flex">
//                     <div className="flex justify-between space-x-2 rtl:space-x-reverse">
//                       {type.users?.length > 1 && (
//                         <AvatarGroup
//                           border="border-2 border-white"
//                           className="relative top-1 right-3"
//                           size={8}
//                           truncateAfter={4}
//                           items={type.users.map((organizer) => ({
//                             alt: organizer.name || "",
//                             image: `${WEBAPP_URL}/${organizer.username}/avatar.png`,
//                             title: organizer.name || "",
//                           }))}
//                         />
//                       )}
//                       <div className="flex items-center justify-between space-x-2 rtl:space-x-reverse">
//                         {type.hidden && (
//                           <Badge variant="gray" size="lg">
//                             {t("hidden")}
//                           </Badge>
//                         )}
//                         <Tooltip content={t("show_eventtype_on_profile") as string}>
//                           <div className="self-center rounded-md p-2 hover:bg-gray-200">
//                             <Switch
//                               name="Hidden"
//                               checked={!type.hidden}
//                               onCheckedChange={() => {
//                                 setHiddenMutation.mutate({ id: type.id, hidden: !type.hidden });
//                               }}
//                             />
//                           </div>
//                         </Tooltip>

//                         <ButtonGroup combined>
//                           <Tooltip content={t("preview") as string}>
//                             <Button
//                               color="secondary"
//                               target="_blank"
//                               size="icon"
//                               href={calLink}
//                               StartIcon={Icon.FiExternalLink}
//                               combined
//                             />
//                           </Tooltip>

//                           <Tooltip content={t("copy_link") as string}>
//                             <Button
//                               color="secondary"
//                               size="icon"
//                               StartIcon={Icon.FiLink}
//                               onClick={() => {
//                                 showToast(t("link_copied"), "success");
//                                 navigator.clipboard.writeText(calLink);
//                               }}
//                               combined
//                             />
//                           </Tooltip>
//                           <Dropdown modal={false}>
//                             <DropdownMenuTrigger
//                               asChild
//                               data-testid={"event-type-options-" + type.id}
//                               className="radix-state-open:rounded-r-md">
//                               <Button
//                                 type="button"
//                                 size="icon"
//                                 color="secondary"
//                                 combined
//                                 StartIcon={Icon.FiMoreHorizontal}
//                               />
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent>
//                               <DropdownMenuItem>
//                                 <DropdownItem
//                                   type="button"
//                                   data-testid={"event-type-edit-" + type.id}
//                                   StartIcon={Icon.FiEdit2}
//                                   onClick={() => router.push("/event-types/" + type.id)}>
//                                   {t("edit") as string}
//                                 </DropdownItem>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem className="outline-none">
//                                 <DropdownItem
//                                   type="button"
//                                   data-testid={"event-type-duplicate-" + type.id}
//                                   StartIcon={Icon.FiCopy}
//                                   onClick={() => openModal(group, type)}>
//                                   {t("duplicate") as string}
//                                 </DropdownItem>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem className="outline-none">
//                                 <EmbedButton
//                                   as={DropdownItem}
//                                   type="button"
//                                   StartIcon={Icon.FiCode}
//                                   className="w-full rounded-none"
//                                   embedUrl={encodeURIComponent(embedLink)}>
//                                   {t("embed")}
//                                 </EmbedButton>
//                               </DropdownMenuItem>
//                               <DropdownMenuSeparator className="h-px bg-gray-200" />
//                               {/* readonly is only set when we are on a team - if we are on a user event type null will be the value. */}
//                               {(group.metadata?.readOnly === false || group.metadata.readOnly === null) && (
//                                 <DropdownMenuItem>
//                                   <DropdownItem
//                                     onClick={() => {
//                                       setDeleteDialogOpen(true);
//                                       setDeleteDialogTypeId(type.id);
//                                     }}
//                                     StartIcon={Icon.FiTrash}
//                                     className="w-full rounded-none">
//                                     {t("delete") as string}
//                                   </DropdownItem>
//                                 </DropdownMenuItem>
//                               )}
//                             </DropdownMenuContent>
//                           </Dropdown>
//                         </ButtonGroup>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="min-w-9 mr-5 flex sm:hidden">
//                   <Dropdown>
//                     <DropdownMenuTrigger asChild data-testid={"event-type-options-" + type.id}>
//                       <Button type="button" size="icon" color="secondary" StartIcon={Icon.FiMoreHorizontal} />
//                     </DropdownMenuTrigger>
//                     <DropdownMenuPortal>
//                       <DropdownMenuContent>
//                         <DropdownMenuItem className="outline-none">
//                           <Link href={calLink}>
//                             <a target="_blank">
//                               <Button
//                                 color="minimal"
//                                 StartIcon={Icon.FiExternalLink}
//                                 className="w-full rounded-none">
//                                 {t("preview") as string}
//                               </Button>
//                             </a>
//                           </Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="outline-none">
//                           <Button
//                             type="button"
//                             color="minimal"
//                             className="w-full rounded-none text-left"
//                             data-testid={"event-type-duplicate-" + type.id}
//                             StartIcon={Icon.FiClipboard}
//                             onClick={() => {
//                               navigator.clipboard.writeText(calLink);
//                               showToast(t("link_copied"), "success");
//                             }}>
//                             {t("copy_link") as string}
//                           </Button>
//                         </DropdownMenuItem>
//                         {isNativeShare ? (
//                           <DropdownMenuItem className="outline-none">
//                             <Button
//                               type="button"
//                               color="minimal"
//                               className="w-full rounded-none"
//                               data-testid={"event-type-duplicate-" + type.id}
//                               StartIcon={Icon.FiUpload}
//                               onClick={() => {
//                                 navigator
//                                   .share({
//                                     title: t("share"),
//                                     text: t("share_event"),
//                                     url: calLink,
//                                   })
//                                   .then(() => showToast(t("link_shared"), "success"))
//                                   .catch(() => showToast(t("failed"), "error"));
//                               }}>
//                               {t("share") as string}
//                             </Button>
//                           </DropdownMenuItem>
//                         ) : null}
//                         <DropdownMenuItem className="outline-none">
//                           <Button
//                             type="button"
//                             onClick={() => router.push("/event-types/" + type.id)}
//                             color="minimal"
//                             className="w-full rounded-none"
//                             StartIcon={Icon.FiEdit}>
//                             {t("edit") as string}
//                           </Button>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="outline-none">
//                           <Button
//                             type="button"
//                             color="minimal"
//                             className="w-full rounded-none"
//                             data-testid={"event-type-duplicate-" + type.id}
//                             StartIcon={Icon.FiCopy}
//                             onClick={() => openModal(group, type)}>
//                             {t("duplicate") as string}
//                           </Button>
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator className="h-px bg-gray-200" />
//                         <DropdownMenuItem className="outline-none">
//                           <Button
//                             onClick={() => {
//                               setDeleteDialogOpen(true);
//                               setDeleteDialogTypeId(type.id);
//                             }}
//                             color="destructive"
//                             StartIcon={Icon.FiTrash}
//                             className="w-full rounded-none">
//                             {t("delete") as string}
//                           </Button>
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenuPortal>
//                   </Dropdown>
//                 </div>
//               </div>
//             </li>
//           );
//         })}
//       </ul>
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <ConfirmationDialogContent
//           variety="danger"
//           title={t("delete_event_type")}
//           confirmBtnText={t("confirm_delete_event_type")}
//           loadingText={t("confirm_delete_event_type")}
//           onConfirm={(e) => {
//             e.preventDefault();
//             deleteEventTypeHandler(deleteDialogTypeId);
//           }}>
//           {t("delete_event_type_description") as string}
//         </ConfirmationDialogContent>
//       </Dialog>
//     </div>
//   );
// };

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: "https://app.cal.com/api/trpc/",
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Popup />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const copyClipboard = (url: string) => {
  toast.dismiss();
  toast.success("Link Copied!", {
    iconTheme: {
      primary: "#000",
      secondary: "#fff",
    },
    duration: 2000,
    position: "bottom-right",
    className: "bg-[#000000] text-white",
  });
  return navigator.clipboard.writeText(url);
};

const redirectUrl = (url: string, logout: boolean) => {
  if (logout) {
    if (window.confirm("Are you sure you want to log out ?")) {
      return window.open(url, "_blank");
    }
    return;
  }
  return chrome.tabs.create({ url: url, active: false });
};

// const SkeletonLoader = () => {
//   return (
//     <SkeletonContainer>
//       <div className="mt-6 mb-8 space-y-6 divide-y">
//         <div className="flex items-center">
//           <SkeletonAvatar className=" h-12 w-12 px-4" />
//           <SkeletonButton className=" ml-4 h-6 w-32 rounded-md p-5" />
//         </div>
//         <SkeletonText className="h-8 w-full" />
//         <SkeletonText className="h-8 w-full" />
//         <SkeletonText className="h-8 w-full" />

//         <SkeletonButton className="mr-6 h-8 w-20 rounded-md p-5" />
//       </div>
//     </SkeletonContainer>
//   );
// };

const LoggedOut = () => {
  return (
    <div>
      <p> Welcome to cal.com for Chrome</p>
      <a target="_blank" href="https://app.cal.com/auth/login" rel="noopener noreferrer">
        Sign in
      </a>
    </div>
  );
};

const LoggedIn = ({ user, avatar }: { user: EventTypeGroup; avatar: string }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans">
      <div className="flex justify-between">
        <Dropdown open={menuOpen}>
          <DropdownMenuTrigger
            onClick={() => setMenuOpen((menuOpen) => !menuOpen)}
            asChild
            className="radix-state-open:rounded-r-md">
            <div className=" flex h-12 w-52 items-center rounded-md py-7 pl-3 pr-1 hover:cursor-pointer hover:bg-gray-200">
              <Avatar imageSrc={avatar} size="mdLg" alt="avatar" className="" />
              <div className=" ml-2 items-end ">
                <h2 className="my-0.5 font-medium">{user.profile.name}</h2>
                <p>cal.com/{user.profile.slug}</p>
              </div>
              <Icon.FiMoreVertical className="ml-2 inline-block h-4 w-4 text-gray-500" aria-hidden="true" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              onInteractOutside={() => {
                setMenuOpen(false);
              }}>
              <DropdownMenuItem>
                <DropdownItem
                  onClick={() => redirectUrl(`https://app.cal.com/${user.profile.slug}`, false)}
                  type="button"
                  data-testid="event-type-edit-"
                  StartIcon={Icon.FiExternalLink}>
                  View Public page
                </DropdownItem>
              </DropdownMenuItem>
              <DropdownMenuItem className="outline-none">
                <DropdownItem
                  onClick={() => copyClipboard(`https://app.cal.com/${user.profile.slug}`)}
                  type="button"
                  data-testid="event-type-duplicate-"
                  StartIcon={Icon.FiLink}>
                  Copy public page link
                </DropdownItem>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="h-px bg-gray-200" />
              <DropdownMenuItem className="outline-none">
                <DropdownItem
                  onClick={() => redirectUrl("https://app.cal.com/event-types", false)}
                  type="button"
                  data-testid="event-type-duplicate-"
                  StartIcon={Icon.FiHome}>
                  Home
                </DropdownItem>
              </DropdownMenuItem>
              <DropdownMenuItem className="outline-none">
                <DropdownItem
                  onClick={() => redirectUrl(`https://app.cal.com/bookings/upcoming`, false)}
                  type="button"
                  data-testid="event-type-duplicate-"
                  StartIcon={Icon.FiBookOpen}>
                  View bookings
                </DropdownItem>
              </DropdownMenuItem>
              <DropdownMenuItem className="outline-none">
                <DropdownItem
                  onClick={() => {
                    redirectUrl("https://cal.com/auth/logout", true);
                  }}
                  type="button"
                  data-testid="event-type-duplicate-"
                  StartIcon={Icon.FiLogOut}>
                  Logout
                </DropdownItem>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </Dropdown>
        <Button
          className="text-end"
          StartIcon={Icon.FiPlus}
          onClick={() =>
            redirectUrl(
              `https://app.cal.com/event-types?dialog=new-eventtype&eventPage=${user.profile.slug}`,
              false
            )
          }>
          New Event
        </Button>
      </div>

      <h1 className="font-cal my-5">Event types:</h1>
      {/* <EventsList types={user.eventTypes} group={user} groupIndex={0} readOnly={user.metadata.readOnly} /> */}
      <ul>
        {user.eventTypes.map((event) => (
          <li key={event.slug} className=" font-extrabold text-red-500">
            {event.title}:{" "}
            <button
              onClick={() => {
                copyClipboard(`https://app.cal.com/${user.profile.slug}/${event.slug}`);
              }}>
              Copy Link
            </button>
            <button
              onClick={() =>
                window.open(`https://app.cal.com/event-types/${event.id}?tabName=setup`, "_blank")
              }>
              Edit
            </button>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Popup = () => {
  const response = trpc.viewer.eventTypes.getByViewer.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error.shape.json.message === "UNAUTHORIZED") return false;
      return failureCount > 3;
    },
  });

  const eventTypes = response.data?.json?.eventTypeGroups[0];

  const avatar = `https://cal.com/${eventTypes?.profile?.slug}/avatar.png`;

  const isLoading = !!response.isLoading;
  const isLoggedIn = response.error?.shape?.json?.message !== "UNAUTHORIZED";

  if (isLoading) {
    return (
      <div className=" mx-5 my-5 h-[250px]  w-[700px]">
        <Loader />
        {/* <SkeletonLoader />{" "} */}
      </div>
    );
  }

  return (
    <>
      <div className=" mx-5 my-5 h-[250px]  w-[700px]">
        <div>{isLoggedIn ? <LoggedIn user={eventTypes} avatar={avatar} /> : <LoggedOut />}</div>
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
  document.getElementById("root")
);
